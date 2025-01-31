import { Router } from "express";
import { router as runnerRouter } from "./runner";

export const router: Router = Router();

router.use("/runner", runnerRouter);
