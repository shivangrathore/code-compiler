import { Lang } from "./zod";

export type Job =
  | {
      state: "running" | "timeout" | "queued" | "error";
    }
  | {
      state: "done";
      result: string;
      exitCode: number;
    };

export type QueueJob = {
  id: string;
  code: string;
  lang: Lang;
};
