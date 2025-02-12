import { useCompiler } from "@/providers/compiler.provider";
import {
  CheckIcon,
  CircleEllipsisIcon,
  ClockIcon,
  Loader2Icon,
} from "lucide-react";
import React, { ReactNode } from "react";

const StateIndicator = ({ state }: { state: string }) => {
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
  };

  const currentState = stateMap[state];

  if (!currentState) {
    return null;
  }

  return <div className="flex items-center gap-2">{currentState}</div>;
};

const Output = () => {
  const { output, state } = useCompiler();

  return (
    <div className="flex-grow overflow-auto bg-editor-background text-editor-foreground">
      <div className="flex justify-between items-center p-4 shadow shadow-black/40">
        <h5 className="font-bold">Output</h5>
        <StateIndicator state={state} />
      </div>
      <pre className="p-2">{output}</pre>
    </div>
  );
};

export default React.memo(Output);
