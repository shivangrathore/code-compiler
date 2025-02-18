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
  text,
  className,
  line = true,
}: {
  icon: LucideIcon;
  text: string;
  className?: string;
  line?: boolean;
}) {
  const pillVariants = {
    hidden: { opacity: 0, x: 400 },
    visible: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  };
  return (
    <React.Fragment key={text}>
      <motion.div
        className={cn("gr5 p-0.5 w-fit pill-r", className)}
        variants={pillVariants}
      >
        <div className="pill-bg pill-r">
          <div className="pill-gr p-[16px] pill-r flex gap-2 items-center">
            <Icon className="size-6" />
            <span>{text}</span>
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
      <SnippetCountPill />
      <Pill icon={GithubIcon} text="100% Open Source" className="ml-[280px]" />
      <Pill
        icon={CodeIcon}
        text="Supports multiple languages"
        className="ml-[80px]"
        line={false}
      />
    </motion.div>
  );
}

function SnippetCountPill() {
  const { data: compiledCount } = useQuery({
    async queryFn() {
      const stats = await httpClient.get("/stats");
      const data: { lang: Lang; count: number }[] = stats.data;
      return data.reduce((total, { count }) => total + count, 0);
    },
    queryKey: ["stats"],
  });
  return (
    <Suspense>
      <Pill
        icon={CheckIcon}
        text={`${compiledCount || 200} snippets compiled`}
      />
    </Suspense>
  );
}
