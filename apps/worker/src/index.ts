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
  console.log(`Processing job: ${job.id}`);
  await redis.hset(
    "executor:jobs",
    job.id,
    JSON.stringify({ state: "running" } as Job),
  );
  const command = ["run", "--rm"];
  if (job.lang == "javascript") {
    command.push("node:latest", "node", "-e", job.code);
  } else {
    command.push("python:latest", "python", "-c", job.code);
  }

  const process = spawn("docker", command);
  process.stdout.setEncoding("utf8");
  try {
    const { result, exitCode } = await new Promise<{
      result: string;
      exitCode: number;
    }>(async (resolve, reject) => {
      const jobTimeout = setTimeout(() => {
        reject(new TimeoutError("Timeout"));
      }, 5000);
      const lines: string[] = [];
      process.stdout.on("data", (data) => {
        lines.push(data);
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
    console.log("Got output:", result);
  } catch (e) {
    if (e instanceof TimeoutError) {
      console.log("Job timed out");
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
