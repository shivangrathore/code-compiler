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
import { SettingsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Topbar() {
  const {
    runCode,
    lang,
    setLang,
    fontSize,
    setFontSize,
    setVimEnabled,
    vimEnabled,
    vimMode,
  } = useCompiler();
  return (
    <div className="flex items-center justify-between p-4 bg-editor-background text-editor-foreground text-black shadow shadow-black/25 relative z-50 shadow shadow-black/40">
      <Link href="/" className="text-xl font-bold">
        Code Compiler
      </Link>
      <div className="flex gap-2 items-center">
        {vimEnabled && <span className="text-sm text-gray-500">{vimMode}</span>}
        <Select onValueChange={(value) => setLang(value as Lang)} value={lang}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">Javascript</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <SettingsIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span>Font Size ({fontSize})</span>
                <input
                  type="range"
                  min={12}
                  max={48}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span>Vim Mode</span>
                <input
                  type="checkbox"
                  onChange={(e) => setVimEnabled(e.target.checked)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button className="shrink-0" onClick={runCode}>
          Run Code
        </Button>
      </div>
    </div>
  );
}
