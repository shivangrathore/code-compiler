import express from "express";
import { handler as authHandler } from "@repo/auth";
import "dotenv/config";
import { router as runnerRouter } from "./routes/runner";

const app = express();

// Mount auth router before the JSON parser
app.use("/api/auth", authHandler);

app.use(express.json());
app.use(runnerRouter);
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
