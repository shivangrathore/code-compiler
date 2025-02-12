"use client";
import "./editor.style.css";
import React from "react";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { useCompiler } from "@/providers/compiler.provider";
import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import { vim } from "@replit/codemirror-vim";
import { EditorView } from "@codemirror/view";

const languages = {
  javascript: javascript,
  python: python,
  c: cpp,
  java: java,
};

function Editor() {
  const { code, setCode, lang, fontSize, vimEnabled, setVimMode } =
    useCompiler();
  const onChange = React.useCallback(
    (val: string, _viewUpdate: ViewUpdate) => {
      setCode(val);
    },
    [setCode],
  );
  const language = languages[lang];

  return (
    <CodeMirror
      theme={tokyoNightInit({
        settings: { fontFamily: "JetBrains Mono", fontSize: `${fontSize}px` },
      })}
      extensions={[
        language(),
        vimEnabled ? vim() : [],
        EditorView.updateListener.of((update) => {
          // @ts-ignore
          setVimMode(update.view.cm?.state?.vim?.mode || "normal");
        }),
      ]}
      value={code}
      onChange={onChange}
      className="flex flex-row flex-grow"
    />
  );
}
export default Editor;
