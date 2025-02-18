import { useCompiler } from "@/providers/compiler.provider";
import {
  CheckIcon,
  CircleEllipsisIcon,
  CircleX,
  ClockIcon,
  Loader2Icon,
} from "lucide-react";
import React, { ReactNode } from "react";

const StateIndicator = () => {
  const { state, exitCode } = useCompiler();
  const stateMap: Record<string, ReactNode> = {
    queued: (
      <CircleEllipsisIcon aria-hidden="true" className="text-yellow-500" />
    ),
    running: (
      <Loader2Icon
        className="animate-spin text-yellow-500"
        aria-hidden="true"
      />
    ),
    done: <CheckIcon aria-hidden="true" className="text-green-500" />,
    timeout: <ClockIcon aria-hidden="true" className="text-red-500" />,
    error: <CircleX aria-hidden="true" className="text-red-500" />,
  };

  let currentState = null;

  if (state == "done" && exitCode !== 0 && exitCode !== null) {
    currentState = stateMap["error"];
  } else {
    currentState = stateMap[state];
  }

  if (!currentState) {
    return null;
  }

  return <div className="flex items-center gap-2">{currentState}</div>;
};

const Output = () => {
  const { output } = useCompiler();

  return (
    <div className="flex-grow overflow-auto bg-editor-background text-editor-foreground">
      <div className="flex justify-between items-center p-4 shadow shadow-black/40">
        <h5 className="font-bold">Output</h5>
        <StateIndicator />
      </div>
      <pre className="p-2">{output}</pre>
    </div>
  );
};

export default React.memo(Output);
