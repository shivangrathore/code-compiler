"use client";
import httpClient from "@/lib/http-client";
import { Lang } from "@repo/types/zod";
import { Job, JobState } from "@repo/types";
import React from "react";

type CompilerProviderProps = {
  lang: Lang;
  code: string;
  output: string;
  state: string;
  setCode: (value: string) => void;
  setLang: (lang: Lang) => void;
  runCode: () => void;
};

const Context = React.createContext<CompilerProviderProps | undefined>(
  undefined,
);

export default function CompilerProvider({
  children,
}: React.PropsWithChildren) {
  const [lang, setLang] = React.useState<Lang>("python");
  const [code, setCode] = React.useState<string>("");
  const [output, setOutput] = React.useState<string>("");
  const [state, setState] = React.useState<JobState | "idle">("idle");
  React.useEffect(() => {
    if (lang === "javascript") {
      setCode("console.log('hello world!');");
    } else if (lang === "python") {
      setCode("print('hello world!')");
    }
  }, [lang]);
  const pollOutput = async (id: string) => {
    setState("idle");
    setOutput("");
    while (true) {
      console.log("Polling Output");
      const res = await httpClient.get(`/runner/poll?id=${id}`);
      const data = res.data as Job;
      setState(data.state);
      if (data.state == "done") {
        setOutput(data.result);
        break;
      } else if (data.state == "timeout") {
        setOutput("Job timed out");
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  };

  const runCode = async () => {
    const res = await httpClient.post("/runner/execute", { lang, code });
    await pollOutput(res.data.id);
  };
  return (
    <Context.Provider
      value={{ lang, setLang, code, setCode, runCode, output, state }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCompiler() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error("useCompiler must be used within a CompilerProvider");
  }
  return context;
}
