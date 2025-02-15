"use client";
import CompilerProvider from "@/providers/compiler.provider";
import Editor from "./editor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Output from "./output";
import Topbar from "./topbar";
import { Suspense } from "react";

export default function CompilerPage() {
  return (
    <div className="flex h-screen flex-col ">
      <Suspense>
        <CompilerProvider>
          <Topbar />
          <PanelGroup
            direction="vertical"
            className="flex flex-col flex-grow md:!hidden"
          >
            <Panel className="flex flex-grow" minSize={20}>
              <Editor />
            </Panel>
            <PanelResizeHandle className="w-full h-1 bg-white/20" />
            <Panel className="flex flex-grow" minSize={8}>
              <Output />
            </Panel>
          </PanelGroup>
          <PanelGroup
            direction="horizontal"
            className="flex flex-grow max-md:!hidden"
          >
            <Panel className="flex flex-grow" minSize={20}>
              <Editor />
            </Panel>
            <PanelResizeHandle className="h-full w-0.5 bg-white/20" />
            <Panel className="flex flex-grow" minSize={20}>
              <Output />
            </Panel>
          </PanelGroup>
        </CompilerProvider>
      </Suspense>
    </div>
  );
}
