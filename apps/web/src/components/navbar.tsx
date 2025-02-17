"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
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
    return () => window.removeEventListener("scroll", handleScroll);
  });
  return (
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
          <span className="text-primary">C</span>
          ode <span className="text-primary">C</span>ompiler
        </Link>
        <div className="hidden lg:flex space-x-20 text-lg">
          <Link href="/about">Features</Link>
          <Link href="/docs">Flow</Link>
          <Link href="/blog">Github</Link>
          <Link href="/docs">Docs</Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "http://localhost:3000/compiler",
              })
            }
          >
            Login
          </Button>
          <Link
            href="/compiler"
            className={buttonVariants({ className: "max-lg:hidden rounded" })}
          >
            Code Now
          </Link>
        </div>
        <Button variant="ghost" className="lg:hidden">
          <MenuIcon className="size-10" />
        </Button>
      </div>
    </motion.header>
  );
}
