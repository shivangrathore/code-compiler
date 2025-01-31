import express from "express";
import { handler as authHandler } from "@repo/auth";
import "dotenv/config";

const app = express();

// Mount auth router before the JSON parser
app.use("/api/auth", authHandler);

app.use(express.json());
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.post("/run", (req, res) => {});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
