"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useCompiler } from "@/providers/compiler.provider";
import { Lang } from "@repo/types/zod";
import Link from "next/link";

export default function Topbar() {
  const { runCode, lang, setLang } = useCompiler();
  return (
    <div className="flex items-center justify-between p-4 bg-editor-background text-editor-foreground text-black shadow shadow-black/25 relative z-50 shadow shadow-black/40">
      <Link href="/" className="text-xl font-bold">
        Code Compiler
      </Link>
      <div className="flex gap-2 items-center">
        <Select onValueChange={(value) => setLang(value as Lang)} value={lang}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">Javascript</SelectItem>
          </SelectContent>
        </Select>
        <Button className="shrink-0" onClick={runCode}>
          Run Code
        </Button>
      </div>
    </div>
  );
}
