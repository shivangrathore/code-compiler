import express from "express";
import { handler as authHandler } from "@repo/auth";
import "dotenv/config";
import cors from "cors";
import { router as apiRouter } from "./routes";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cc.seekhcode.me"],
  }),
);

app.all("/api/auth/*", authHandler);

app.use(express.json());
app.use("/api", apiRouter);
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
