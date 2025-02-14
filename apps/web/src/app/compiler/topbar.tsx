"use client";
import { Button } from "@/components/ui/button";
import { useCompiler } from "@/providers/compiler.provider";
import { Lang } from "@repo/types/zod";
import Link from "next/link";
import {
  BanIcon,
  Check,
  ChevronsUpDown,
  PlayIcon,
  SettingsIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const languages: { value: Lang; label: string }[] = [
  { label: "C", value: "c" },
  { label: "Python", value: "python" },
  { label: "Javascript", value: "javascript" },
  { label: "Java", value: "java" },
];

function LanguageCombobox({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const { lang, setLang } = useCompiler();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between items-center font-normal text-sm p-2 border-gray-700 text-gray-300"
        >
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          <span className="">
            {languages.find((l) => l.value === lang)?.label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 border-gray-700">
        <Command className="bg-editor-background text-editor-foreground">
          <CommandInput placeholder="Search Language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={(currentValue) => {
                    setLang(currentValue as Lang);
                    setOpen(false);
                  }}
                  className="data-[selected=true]:bg-primary"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      lang === language.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function SettingsButton() {
  const { setFontSize, setVimEnabled, fontSize } = useCompiler();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-700">
          <SettingsIcon className="size-5" strokeWidth="1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-editor-background">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-0">
          <div className="p-4 block sm:hidden">
            <div className="flex items-center justify-between">
              <span>Language</span>
              <LanguageCombobox />
            </div>
          </div>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Topbar() {
  const { runCode, vimEnabled, vimMode, state, stopExecution, canStop } =
    useCompiler();
  return (
    <div className="items-center gap-4 justify-between p-4 bg-editor-background text-editor-foreground text-black relative z-50 shadow shadow-black/40 flex">
      <Link href="/" className="text-xl font-bold">
        Code Compiler
      </Link>
      <div className="flex gap-2 items-center">
        {vimEnabled && <span className="text-sm text-gray-500">{vimMode}</span>}
        <LanguageCombobox className="max-sm:hidden" />
        <SettingsButton />
        {state == "queued" || state == "running" ? (
          <Button
            onClick={stopExecution}
            className="bg-red-500"
            disabled={state == "running" || !canStop}
          >
            <BanIcon className="size-5 fill-foreground" strokeWidth={1} />
          </Button>
        ) : (
          <Button onClick={runCode}>
            <PlayIcon className="size-5 fill-foreground" strokeWidth={1} />
          </Button>
        )}
      </div>
    </div>
  );
}
