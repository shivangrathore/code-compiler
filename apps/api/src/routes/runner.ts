import { Router } from "express";
import { spawn } from "child_process";
import { RunCode } from "@repo/types/zod";
import { Job } from "@repo/types";
import { v4 as uuidv4 } from "uuid";

const jobs = new Map<string, Job>();
export const router: Router = Router();
router.post("/execute", async (req, res) => {
  const body = await RunCode.parseAsync(req.body);
  const process = spawn("docker", [
    "run",
    "--rm",
    "node:latest",
    "node",
    "-e",
    body.code,
  ]);
  process.stdout.setEncoding("utf8");
  const lines: string[] = [];
  process.stdout.on("data", (data) => {
    lines.push(data);
  });
  const id = uuidv4();
  const jobTimeout = setTimeout(() => {
    const job = jobs.get(id);
    if (job && job.state === "running") {
      process.kill();
      jobs.set(id, { state: "timeout" });
    }
  }, 5000);
  jobs.set(id, { state: "running" });

  process.on("exit", (code) => {
    clearTimeout(jobTimeout);
    jobs.set(id, { state: "done", result: lines.join(""), code: code || 0 });
  });

  res.send({ id });
});

router.get("/poll", async (req, res) => {
  const id = req.query.id as string;
  const job = jobs.get(id);
  if (!job) {
    res.status(404).json();
    return;
  }
  switch (job.state) {
    case "running":
      res.status(202).json({ status: "running" });
      break;
    case "timeout":
      res.json({ status: "timeout" });
      break;
    case "done":
      res.json({ status: "done", result: job.result });
      break;
  }
});
