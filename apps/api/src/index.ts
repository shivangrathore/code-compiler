import express from "express";
import { handler as authHandler } from "@repo/auth";
import "dotenv/config";
import cors from "cors";
import { router as apiRouter } from "./routes";

const app = express();
app.options("*", cors());
app.use(cors());

// Mount auth router before the JSON parser
app.use("/api/auth", authHandler);

app.use(express.json());
app.use("/api", apiRouter);
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
