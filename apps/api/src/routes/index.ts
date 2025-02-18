import { Router } from "express";
import { router as runnerRouter } from "./runner";
import db from "@repo/db/client";

export const router: Router = Router();

router.use("/runner", runnerRouter);
router.get("/stats", async (_, res) => {
  const result = await db.executionStats.findMany();
  res.json(result);
});
