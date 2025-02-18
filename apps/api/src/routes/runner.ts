import { Router } from "express";
import { RunCode } from "@repo/types/zod";
import { Job, QueueJob } from "@repo/types";
import { v4 as uuidv4 } from "uuid";
import redis from "@repo/redis/client";
import db from "@repo/db/client";

// TODO: Implement zod validation for the request body for api routes
// TODO: Makes these endpoint typesafe

export const router: Router = Router();
router.post("/execute", async (req, res) => {
  const body = await RunCode.parseAsync(req.body);
  const id = uuidv4();
  const multi = redis.multi();
  multi.hset(
    "executor:jobs",
    id,
    JSON.stringify({
      state: "queued",
    } as Job),
  );
  multi.lpush(
    "executor:queue",
    JSON.stringify({
      id: id,
      code: body.code,
      lang: body.lang,
    } as QueueJob),
  );
  multi.exec();
  res.send({ id });
});

router.post("/stop", async (req, res) => {
  const id = req.body.id as string;
  const _job = await redis.hget("executor:jobs", id);
  if (!_job) {
    res.status(404).json();
    return;
  }
  const job = JSON.parse(_job) as Job;
  if (job.state === "queued") {
    res.status(400).json({ error: "Task is not in queue" });
    return;
  }
  await redis.hdel("executor:jobs", id);
  res.json();
});

router.get("/poll", async (req, res) => {
  const id = req.query.id as string;
  const _job = await redis.hget("executor:jobs", id);
  if (!_job) {
    res.status(404).json();
    return;
  }
  const job = JSON.parse(_job) as Job;
  let newJob: Job;
  res.header("Cache-Control", "no-store");
  switch (job.state) {
    case "queued":
      newJob = { state: "queued" };
      res.status(202).json(newJob);
      break;
    case "running":
      newJob = { state: "running" };
      res.status(202).json(newJob);
      break;
    case "timeout":
      newJob = { state: "timeout" };
      res.json(newJob);
      break;
    case "done":
      newJob = { state: "done", result: job.result, exitCode: job.exitCode };
      res.json(newJob);
      break;
    default:
      res.status(500).json();
      break;
  }
});
