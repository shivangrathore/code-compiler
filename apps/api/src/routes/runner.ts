import { Router } from "express";
import { RunCode } from "@repo/types/zod";
import { Job, QueueJob } from "@repo/types";
import { v4 as uuidv4 } from "uuid";
import redis from "@repo/redis/client";

// TODO: Implement zod validation for the request body for api routes

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
  res.header("Cache-Control", "no-store");
  switch (job.state) {
    case "queued":
      res.status(202).json({ state: "queued" });
      break;
    case "running":
      res.status(202).json({ state: "running" });
      break;
    case "timeout":
      res.json({ state: "timeout" });
      break;
    case "done":
      res.json({ state: "done", result: job.result });
      break;
    default:
      res.status(500).json();
      break;
  }
});
