import { useCompiler } from "@/providers/compiler.provider";
import {
  CheckIcon,
  CircleEllipsisIcon,
  ClockIcon,
  Loader2Icon,
} from "lucide-react";
import React, { ReactNode } from "react";

const StateIndicator = ({ state }: { state: string }) => {
  const stateMap: Record<string, { icon: ReactNode; label: string }> = {
    queued: {
      icon: <CircleEllipsisIcon aria-hidden="true" />,
      label: "Queued",
    },
    running: {
      icon: <Loader2Icon className="animate-spin" aria-hidden="true" />,
      label: "Running",
    },
    done: { icon: <CheckIcon aria-hidden="true" />, label: "Done" },
    timeout: { icon: <ClockIcon aria-hidden="true" />, label: "Timeout" },
  };

  const currentState = stateMap[state];

  if (!currentState) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="capitalize">{currentState.label}</span>
      {currentState.icon}
    </div>
  );
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
