"use client";
import httpClient from "@/lib/http-client";
import { Lang } from "@repo/types/zod";
import { Job, JobState } from "@repo/types";
import React from "react";

type CompilerProviderProps = {
  vimEnabled: boolean;
  vimMode: "normal" | "insert" | "visual";
  lang: Lang;
  code: string;
  output: string;
  state: JobState;
  fontSize: number;
  setVimEnabled: (value: boolean) => void;
  setVimMode: (mode: "normal" | "insert" | "visual") => void;
  setCode: (value: string) => void;
  setLang: (lang: Lang) => void;
  runCode: () => void;
  setFontSize: (size: number) => void;
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
  const [state, setState] = React.useState<JobState>("done");
  const [fontSize, setFontSize] = React.useState(16);
  const [vimEnabled, setVimEnabled] = React.useState(false);
  const [vimMode, setVimMode] = React.useState<"normal" | "insert" | "visual">(
    "normal",
  );
  React.useEffect(() => {
    if (lang === "javascript") {
      setCode("console.log('hello world!');");
    } else if (lang === "python") {
      setCode("print('hello world!')");
    }
  }, [lang]);
  const pollOutput = async (id: string) => {
    setState("queued");
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
      value={{
        lang,
        vimMode,
        setVimMode,
        setLang,
        code,
        setCode,
        runCode,
        output,
        state,
        fontSize,
        setFontSize,
        vimEnabled,
        setVimEnabled,
      }}
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
