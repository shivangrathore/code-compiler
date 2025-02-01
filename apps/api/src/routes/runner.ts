import { Router } from "express";
import { RunCode } from "@repo/types/zod";
import { Job, QueueJob } from "@repo/types";
import { v4 as uuidv4 } from "uuid";
import redis from "@repo/redis/client";

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
