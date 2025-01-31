import { RunCode } from "@repo/zod/api";
import { Router } from "express";
import { spawn } from "child_process";

export const router: Router = Router();
router.post("/execute", async (req, res) => {
  const body = await RunCode.parseAsync(req.body);
  const process = spawn("docker", [
    "run",
    "--rm",
    "python:latest",
    "python",
    "-c",
    body.code,
  ]);
  process.stdout.setEncoding("utf8");
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Transfer-Encoding": "chunked",
  });
  process.stdout.on("data", (data) => {
    res.write(data);
  });
  process.stdout.on("end", () => {
    res.end();
  });
});
