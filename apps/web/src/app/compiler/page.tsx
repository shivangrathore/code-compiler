"use client";
import CompilerProvider from "@/providers/compiler.provider";
import Editor from "./editor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Output from "./output";
import Topbar from "./topbar";
import { Suspense, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useIsClient } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";

export default function CompilerPage() {
  const isClient = useIsClient();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const isRedirecting = useRef(false);
  useEffect(() => {
    if (!user && !isPending && !isRedirecting.current) {
      authClient.signIn.social({
        provider: "google",
        callbackURL: new URL("/compiler", window.location.href).toString(),
      });
      isRedirecting.current = true;
    }
  }, [user, isPending]);
  if (!isClient || isPending || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-editor-background">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }
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
