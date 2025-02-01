import { z } from "zod";

export const Lang = z.enum(["js", "py"]);

export const RunCode = z.object({
  code: z.string(),
  lang: Lang,
});

export type RunCode = z.infer<typeof RunCode>;
export type Lang = z.infer<typeof Lang>;
