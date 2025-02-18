"use client";
import httpClient from "@/lib/http-client";
import { Lang } from "@repo/types/zod";
import { Job, JobState } from "@repo/types";
import React, { useEffect } from "react";
import { useIsClient, useLocalStorage } from "@uidotdev/usehooks";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

// TODO: Implement redux or reducer pattern

type CompilerProviderProps = {
  vimEnabled: boolean;
  vimMode: "normal" | "insert" | "visual";
  lang: Lang;
  code: string;
  output: string;
  state: JobState;
  fontSize: number;
  canStop: boolean;
  exitCode: number | null;
  setVimEnabled: (value: boolean) => void;
  setVimMode: (mode: "normal" | "insert" | "visual") => void;
  setCode: (value: string) => void;
  setLang: (lang: Lang) => void;
  runCode: () => void;
  stopExecution: () => void;
  setFontSize: (size: number) => void;
};

const Context = React.createContext<CompilerProviderProps | undefined>(
  undefined,
);

const defaultCode = {
  python: "print('hello world!')",
  javascript: "console.log('hello world!');",
  c: '#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
};

export default function CompilerProvider({
  children,
}: React.PropsWithChildren) {
  const params = useSearchParams();
  const router = useRouter();
  const lang = Lang.parse(params.get("lang") || "python");
  const [code, setCode] = useLocalStorage<string>(`${lang}:code`, "");
  const [output, setOutput] = React.useState<string>("");
  const [state, setState] = React.useState<JobState>("done");
  const [fontSize, setFontSize] = useLocalStorage("fontSize", 16);
  const [vimEnabled, setVimEnabled] = useLocalStorage("vimEnabled", false);
  const [vimMode, setVimMode] = React.useState<"normal" | "insert" | "visual">(
    "normal",
  );
  const [taskId, setTaskId] = React.useState<string | null>(null);
  const isPolling = React.useRef(false);
  const [canStop, setCanStop] = React.useState(false);
  const [exitCode, setExitCode] = React.useState<number | null>(null);

  function setLang(lang: Lang) {
    const newPathname = "/compiler?" + new URLSearchParams({ lang }).toString();
    router.replace(newPathname, {
      scroll: false,
    });
  }
  React.useEffect(() => {
    if (code) {
      return;
    }
    setCode(defaultCode[lang]);
  }, [lang]);
  const pollOutput = async (id: string) => {
    isPolling.current = true;
    setState("queued");
    setOutput("");
    while (isPolling.current) {
      const res = await httpClient.get(`/runner/poll?id=${id}`);
      const data = res.data as Job;
      setState(data.state);
      if (data.state == "done") {
        setOutput(data.result);
        setExitCode(data.exitCode);
        break;
      } else if (data.state == "timeout") {
        setOutput("Job timed out");
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  };

  const runCode = async () => {
    const res = await httpClient.post("/runner/execute", { lang, code });
    const _taskId = res.data.id;
    setTaskId(_taskId);
    setCanStop(true);
    setExitCode(null);
    await pollOutput(_taskId);
  };

  const stopExecution = async () => {
    try {
      isPolling.current = false;
      const res = await httpClient.post("/runner/stop", { id: taskId });
      console.log(res.status);
      setOutput("Execution stopped");
      setState("error");
      setTaskId(null);
    } catch (e) {
      setCanStop(false);
      await pollOutput(taskId!);
    }
  };
  return (
    <Context.Provider
      value={{
        lang,
        canStop,
        vimMode,
        setVimMode,
        setLang,
        exitCode,
        code,
        setCode,
        runCode,
        stopExecution,
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
