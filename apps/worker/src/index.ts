import redis from "@repo/redis/client";
import { Job, QueueJob } from "@repo/types";
import { spawn } from "child_process";
import db from "@repo/db/client";

class TimeoutError extends Error {}

type JobResult = QueueJob & { state: "done" | "timeout" };

const MAX_CHARACTERS_LIMIT = 1000;

async function worker(): Promise<JobResult | null> {
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
  const command = [
    "run",
    "--rm",
    "--cpus=0.5",
    "--memory=128m",
    "--runtime=runsc",
    `${queueJob.lang}-runner`,
    queueJob.code,
  ];
  console.log("Running command:", ["docker", ...command].join(" "));

  const process = spawn("docker", command);
  process.stdout.setEncoding("utf8");
  try {
    const { result, exitCode } = await new Promise<{
      result: string;
      exitCode: number;
    }>(async (resolve, reject) => {
      const jobTimeout = setTimeout(() => {
        process.kill(9);
        reject(new TimeoutError("Timeout"));
      }, 10000);
      const lines: string[] = [];
      var characters: number = 0;
      process.stdout.on("data", (data) => {
        lines.push(data);
        characters += data.length;
        console.log(characters);
        if (characters > MAX_CHARACTERS_LIMIT) {
          process.kill(9);
        }
      });
      process.stderr.on("data", (data) => {
        lines.push(data);
      });

      process.on("close", async (exitCode) => {
        clearTimeout(jobTimeout);
        resolve({
          result: lines.join("").substring(0, MAX_CHARACTERS_LIMIT),
          exitCode: exitCode || 0,
        });
      });
    });
    const newJob: Job = { state: "done", result, exitCode };
    console.log("Result", result, exitCode);
    await redis.hset("executor:jobs", queueJob.id, JSON.stringify(newJob));
    return { ...queueJob, state: "done" };
  } catch (e) {
    if (e instanceof TimeoutError) {
      const newJob: Job = { state: "timeout" };
      await redis.hset("executor:jobs", queueJob.id, JSON.stringify(newJob));
      return { ...queueJob, state: "timeout" };
    }
    console.log("Error", e);
    return null;
  }
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
