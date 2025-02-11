"use client";
import CompilerProvider from "@/providers/compiler.provider";
import Editor from "./editor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Output from "./output";
import Topbar from "./topbar";

export default function CompilerPage() {
  return (
    <div className="flex h-screen flex-col">
      <CompilerProvider>
        <Topbar />
        <PanelGroup direction="horizontal" className="flex flex-grow">
          <Panel className="flex flex-grow">
            <Editor />
          </Panel>
          <PanelResizeHandle className="h-full w-1 bg-black" />
          <Panel className="flex flex-grow">
            <Output />
          </Panel>
        </PanelGroup>
      </CompilerProvider>
    </div>
  );
}
