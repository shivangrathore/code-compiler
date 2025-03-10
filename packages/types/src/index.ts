import { Lang } from "./zod";

export type Job =
  | {
      state: "running" | "timeout" | "queued";
    }
  | {
      state: "done";
      result: string;
      exitCode: number;
    };

export type JobState = Job["state"];

export type QueueJob = {
  id: string;
  code: string;
  lang: Lang;
  userId: string;
};
