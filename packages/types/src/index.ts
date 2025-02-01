export type Job =
  | {
      state: "running" | "timeout";
    }
  | {
      state: "done";
      result: string;
      code: number;
    };
