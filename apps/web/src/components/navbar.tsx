"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";

const LINKS = [
  { text: "Features", href: "/#features" },
  { text: "Flow", href: "/#flow" },
  { text: "Languages", href: "/#languages" },
  { text: "Github", href: "https://github.com/Wiper-R/code-compiler" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasScrolled, setHasScrolled] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      if (document.body.scrollTop > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    handleScroll();
    document.body.addEventListener("scroll", handleScroll);
    return () => document.body.removeEventListener("scroll", handleScroll);
  });
  return (
    <>
      {/* Mobile Navbar (Always Mounted) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onAnimationStart={() => {
          if (isOpen) {
            document.getElementById("mobile-navbar")!.style.pointerEvents =
              "auto";
          }
        }}
        onAnimationComplete={() => {
          if (!isOpen) {
            document.getElementById("mobile-navbar")!.style.pointerEvents =
              "none";
          }
        }}
        className={cn(
          "z-[999] fixed inset-0 flex flex-col gr1 backdrop-blur-md",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        id="mobile-navbar"
      >
        <div className="absolute gr2 w-[1038px] h-[993px] pointer-events-none -z-10" />
        <div
          className={cn(
            "flex justify-between p-3 items-center max-w-screen-xl mx-auto w-full",
            hasScrolled && "py-0.5",
          )}
        >
          <Link
            href="/"
            className="text-2xl font-bold text-white"
            onClick={() => setIsOpen(false)}
          >
            Code Compiler
          </Link>
          <Button
            variant="ghost"
            className="text-white"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="size-10" />
          </Button>
        </div>

        {/* Links */}
        <div className="flex flex-col justify-center my-auto gap-6 text-white text-2xl font-semibold relative">
          <div className="absolute -z-10 opacity-40">
            <img src="/Lines.png" />
          </div>
          <div className="flex flex-col gap-4 ml-10">
            {LINKS.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-bold"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          hasScrolled && "bg-background/60 backdrop-blur-sm",
        )}
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={cn(
            "flex justify-between p-3 md:p-6 items-center max-w-screen-xl mx-auto w-full transition-all duration-300",
            hasScrolled && "py-0.5 md:py-2",
          )}
        >
          <Link href="/" className="text-2xl font-bold">
            Code Compiler
          </Link>
          <div className="hidden lg:flex space-x-20 text-lg">
            <Link href="/#features">Features</Link>
            <Link href="/#flow">Flow</Link>
            <Link href="/#languages">Languages</Link>
            <Link href="https://github.com/Wiper-R/code-compiler">Github</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/compiler"
              className={buttonVariants({ className: "max-lg:hidden rounded" })}
            >
              Code Now
            </Link>
          </div>
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setIsOpen(true)}
          >
            <MenuIcon className="size-10" />
          </Button>
        </div>
      </motion.header>
    </>
  );
}
