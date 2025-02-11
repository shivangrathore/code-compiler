import { useCompiler } from "@/providers/compiler.provider";

export default function Output() {
  const { output, state } = useCompiler();
  return (
    <div className="flex-grow overflow-auto bg-editor-background text-editor-foreground">
      <div className="flex justify-between items-center p-4 shadow shadow-black/40">
        <h5 className="font-bold">Output</h5>
        <span className="capitalize">{state}</span>
      </div>
      <pre className="p-2">{output}</pre>
    </div>
  );
}
