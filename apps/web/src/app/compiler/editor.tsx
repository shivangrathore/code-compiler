"use client";
import "./editor.style.css";
import React from "react";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { useCompiler } from "@/providers/compiler.provider";

const languages = {
  javascript: javascript,
  python: python,
};

function Editor() {
  const { code, setCode, lang } = useCompiler();
  const onChange = React.useCallback(
    (val: string, viewUpdate: ViewUpdate) => {
      setCode(val);
    },
    [setCode],
  );
  const language = languages[lang];

  return (
    <CodeMirror
      extensions={[language()]}
      value={code}
      onChange={onChange}
      className="text-black flex flex-row flex-grow"
    />
  );
}
export default Editor;
