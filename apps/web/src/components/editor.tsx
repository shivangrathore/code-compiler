"use client";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import type { editor } from "monaco-editor";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import httpClient from "@/lib/http-client";
import { useMutation } from "@tanstack/react-query";

type CustomEditorProps = {
  containerClassname?: string;
  editorClassname?: string;
};

const CustomEditor = ({
  editorClassname,
  containerClassname,
}: CustomEditorProps) => {
  const monaco = useMonaco();
  const [state, setState] = useState("done");
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>();
  useEffect(() => {
    if (!editor || !monaco) {
      return;
    }

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal, () => {
      const options = editor.getOptions();
      const currentFontSize = options.get(monaco.editor.EditorOption.fontSize);
      editor.updateOptions({ fontSize: currentFontSize + 2 });
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus, () => {
      const options = editor.getOptions();
      const currentFontSize = options.get(monaco.editor.EditorOption.fontSize);
      editor.updateOptions({ fontSize: Math.max(currentFontSize - 2, 1) });
    });
  }, [editor, monaco]);

  const [code, setCode] = useState<string>();
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  async function pollExecutionResult(id: string) {
    setState("processing");
    while (true) {
      const { data } = await httpClient.get("/runner/poll", {
        params: { id },
      });
      if (data.status === "done" || data.status === "timeout") {
        setOutput(data.result);
        setState("done");
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  const { mutateAsync: runCode } = useMutation({
    async mutationFn() {
      const { data } = await httpClient.post("/runner/execute", {
        code: code,
        lang: "js",
      });
      return data;
    },
    async onSuccess(data) {
      console.log(data);
      await pollExecutionResult(data.id);
    },
  });

  function EditorToolbar() {
    return (
      <div
        className={cn(
          "flex justify-between items-center bg-zinc-800 p-2",
          containerClassname,
        )}
      >
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="!outline-0 !ring-0 !border-0 !bg-transparent !ring-offset-0 w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="">
            {[
              ["javascript", "JavaScript"],
              ["python", "Python"],
            ].map(([value, label]) => (
              <SelectItem key={value} value={value} className="">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="bg-green-700"
          onClick={async () => runCode()}
        >
          Run Code
        </Button>
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden h-screen">
      <div className="flex flex-col overflow-hidden flex-grow">
        <EditorToolbar />
        <Editor
          className={cn(editorClassname, "flex-grow")}
          value={code}
          onChange={setCode}
          onMount={(e) => {
            setEditor(e);
          }}
          language={language}
          options={{
            scrollBeyondLastLine: false,
            fontSize: 16,
            minimap: { enabled: false },
          }}
          theme="vs-dark"
        />
      </div>
      <OutputPanel state={state} output={output} />
    </div>
  );
};
// TODO: Add state type to OutputPanel
function OutputPanel({ output, state }: { output: string; state: string }) {
  return (
    <div className="bg-gray-700 text-white w-1/2 overflow-auto p-2 flex-grow">
      <h4>Output</h4>
      <hr className="my-2 border-gray-500/40" />
      {state == "processing" ? (
        "Processing..."
      ) : (
        <pre className="whitespace-pre font-mono text-sm">
          <code>{output}</code>
        </pre>
      )}
    </div>
  );
}
export default CustomEditor;
