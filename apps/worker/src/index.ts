import redis from "@repo/redis/client";
import { Job, QueueJob } from "@repo/types";
import { ChildProcess, spawn } from "child_process";
import db from "@repo/db/client";

class TimeoutError extends Error {}

function handleTimeout(process: ChildProcess, reject: (e: Error) => void) {
  process.disconnect();
  process.kill();
  reject(new TimeoutError("Timeout"));
}

async function worker(): Promise<Job | null> {
  const _job = await redis.rpop("executor:queue");
  if (!_job) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return null;
  }

  const job = JSON.parse(_job) as QueueJob;
  await redis.hset(
    "executor:jobs",
    job.id,
    JSON.stringify({ state: "running" } as Job),
  );
  const command = [
    "run",
    "--rm",
    "--cpus=0.5",
    "--memory=128m",
    "--runtime=runsc",
    `${job.lang}-runner`,
    job.code,
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
        process.kill();
        process.disconnect();
        reject(new TimeoutError("Timeout"));
      }, 10000);
      const lines: string[] = [];
      process.stdout.on("data", (data) => {
        lines.push(data);
      });
      process.stderr.on("data", (data) => {
        lines.push(data);
      });
      process.on("close", async (exitCode) => {
        clearTimeout(jobTimeout);
        resolve({
          result: lines.join(""),
          exitCode: exitCode || 0,
        });
      });
    });
    const newJob = { state: "done", result, exitCode } as Job;
    console.log("Result", result, exitCode);
    await redis.hset("executor:jobs", job.id, JSON.stringify(newJob));
    return newJob;
  } catch (e) {
    if (e instanceof TimeoutError) {
      const newJob = { state: "timeout" } as Job;
      await redis.hset("executor:jobs", job.id, JSON.stringify(newJob));
      return newJob;
    } else {
      const newJob = { state: "error" } as Job;
      await redis.hset("executor:jobs", job.id, JSON.stringify(newJob));
      return newJob;
    }
  }
}

async function main() {
  while (true) {
    try {
      await worker();
    } catch (e) {
      console.error(e);
    }
  }
}

main();
