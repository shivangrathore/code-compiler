import redis from "@repo/redis/client";
import { Job, QueueJob } from "@repo/types";
import { spawn } from "child_process";

class TimeoutError extends Error {}

async function worker() {
  const _job = await redis.rpop("executor:queue");
  if (!_job) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
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
        reject(new TimeoutError("Timeout"));
      }, 10000);
      const lines: string[] = [];
      process.stdout.on("data", (data) => {
        lines.push(data);
      });
      process.on("error", (err) => {
        console.error(`Failed to start subprocess: ${err}`);
      });

      process.on("close", (code) => {
        console.log(`Process exited with code ${code}`);
      });
      process.on("exit", async (exitCode) => {
        clearTimeout(jobTimeout);
        resolve({
          result: lines.join(""),
          exitCode: exitCode || 1,
        });
      });
    });
    await redis.hset(
      "executor:jobs",
      job.id,
      JSON.stringify({ state: "done", result, exitCode } as Job),
    );
  } catch (e) {
    if (e instanceof TimeoutError) {
      await redis.hset(
        "executor:jobs",
        job.id,
        JSON.stringify({ state: "timeout" } as Job),
      );
    } else {
      await redis.hset(
        "executor:jobs",
        job.id,
        JSON.stringify({ state: "error" } as Job),
      );
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
