"use client";
import httpClient from "@/lib/http-client";
import { cn } from "@/lib/utils";
import { Lang } from "@repo/types/zod";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, CodeIcon, GithubIcon, LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { Suspense } from "react";

function Pill({
  icon: Icon,
  children,
  className,
  line = true,
}: {
  icon: LucideIcon;
  className?: string;
  line?: boolean;
  children?: React.ReactNode;
}) {
  const pillVariants = {
    hidden: { opacity: 0, x: 400 },
    visible: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  };
  return (
    <React.Fragment>
      <motion.div
        className={cn("gr5 p-0.5 w-fit pill-r", className)}
        variants={pillVariants}
      >
        <div className="pill-bg pill-r">
          <div className="pill-gr p-[16px] pill-r flex gap-2 items-center">
            <Icon className="size-6" />
            {children}
          </div>
        </div>
      </motion.div>
      {line && (
        <div
          className={cn("gr4 h-px w-[400px] -translate-x-[40px]", className)}
        />
      )}
    </React.Fragment>
  );
}

export default function HeroPills() {
  const pillContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="hidden lg:block space-y-16"
      variants={pillContainerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
    >
      <Pill icon={CodeIcon}>
        <SnippetCompiledText />
      </Pill>
      <Pill icon={GithubIcon} className="ml-[280px]">
        <span>100 % Open Source</span>
      </Pill>
      <Pill
        icon={CodeIcon}
        className="ml-[80px]"
        line={false}
      >
        <span>Supports multiple language</span>
      </Pill>
    </motion.div>
  );
}

function SnippetCompiledText() {
  const { data: compiledCount } = useQuery({
    async queryFn() {
      const stats = await httpClient.get("/stats");
      const data: { lang: Lang; count: number }[] = stats.data;
      return data.reduce((total, { count }) => total + count, 0);
    },
    queryKey: ["stats"],
  });

  return <span>{compiledCount || "-"} snippets compiled</span>
}


