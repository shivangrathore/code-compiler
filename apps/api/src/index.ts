import express from "express";
import "dotenv/config";
import cors from "cors";
import { router as apiRouter } from "./routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@repo/auth";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cc.seekhcode.me"],
  }),
);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());
app.use("/api", apiRouter);
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
