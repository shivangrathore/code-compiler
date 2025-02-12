"use client";
import httpClient from "@/lib/http-client";
import { Lang } from "@repo/types/zod";
import { Job, JobState } from "@repo/types";
import React from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useRouter, useSearchParams } from "next/navigation";

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
    if (lang === "javascript") {
      setCode("console.log('hello world!');");
    } else if (lang === "python") {
      setCode("print('hello world!')");
    } else if (lang == "c") {
      setCode(
        '#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}',
      );
    } else if (lang == "java") {
      setCode(
        'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
      );
    }
  }, [lang]);
  const pollOutput = async (id: string) => {
    setState("queued");
    setOutput("");
    while (true) {
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
