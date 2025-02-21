import redis from "@repo/redis/client";
import { Job, QueueJob } from "@repo/types";
import { ChildProcess, execSync, spawn } from "child_process";
import db from "@repo/db/client";

class TimeoutError extends Error {}

type JobResult = QueueJob & { state: "done" | "timeout" };

const MAX_CHARACTERS_LIMIT = 1000;

function terminateContainer(proc: ChildProcess, container_name: string) {
  proc.kill("SIGTERM");
  execSync(`docker rm -f ${container_name}`);
}

async function spawnRunner(
  container_name: string,
  queueJob: QueueJob,
): Promise<JobResult | null> {
  const command = [
    "run",
    "--rm",
    "--cpus=0.5",
    "--memory=128m",
    "--runtime=runsc",
    "--name",
    `${container_name}`,
    `${queueJob.lang}-runner`,
    queueJob.code,
  ];
  const proc = spawn("docker", command, { detached: true });
  proc.stdout.setEncoding("utf8");
  try {
    const { result, exitCode } = await new Promise<{
      result: string;
      exitCode: number;
    }>(async (resolve, reject) => {
      const jobTimeout = setTimeout(() => {
        terminateContainer(proc, container_name);
        reject(new TimeoutError("Timeout"));
      }, 10000);
      const lines: string[] = [];
      var characters: number = 0;
      proc.stdout.on("data", (data) => {
        lines.push(data);
        characters += data.length;
        if (characters > MAX_CHARACTERS_LIMIT) {
          terminateContainer(proc, container_name);
        }
      });
      proc.stderr.on("data", (data) => {
        lines.push(data);
      });

      proc.on("close", async (exitCode) => {
        clearTimeout(jobTimeout);
        resolve({
          result: lines.join("").substring(0, MAX_CHARACTERS_LIMIT),
          exitCode: exitCode || 0,
        });
      });
    });
    const newJob: Job = { state: "done", result, exitCode };
    await redis.hset("executor:jobs", queueJob.id, JSON.stringify(newJob));
    return { ...queueJob, state: "done" };
  } catch (e) {
    if (e instanceof TimeoutError) {
      const newJob: Job = { state: "timeout" };
      await redis.hset("executor:jobs", queueJob.id, JSON.stringify(newJob));
      return { ...queueJob, state: "timeout" };
    }
    return null;
  }
}

async function worker() {
  const queueJobRaw = await redis.rpop("executor:queue");
  if (!queueJobRaw) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return null;
  }

  const queueJob = JSON.parse(queueJobRaw) as QueueJob;
  await redis.hset(
    "executor:jobs",
    queueJob.id,
    JSON.stringify({ state: "running" } as Job),
  );
  const container_name = `${queueJob.lang}-runner__${queueJob.id}`;

  return await spawnRunner(container_name, queueJob);
}

async function main() {
  while (true) {
    try {
      const job = await worker();
      if (!job) {
        continue;
      }
      await db.executionHistory.create({
        data: {
          lang: job.lang,
          userId: job.userId,
          state: job.state,
        },
      });
      await db.executionStats.upsert({
        where: { lang: job.lang },
        create: {
          lang: job.lang,
          count: 1,
        },
        update: {
          count: {
            increment: 1,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
}

main();
