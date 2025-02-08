import {
  BoxIcon,
  CheckIcon,
  CodeIcon,
  DollarSignIcon,
  GaugeIcon,
  GithubIcon,
} from "lucide-react";

export const HERO_PILLS = [
  {
    icon: GithubIcon,
    text: "100% Open Source",
    className: "",
  },
  {
    icon: CodeIcon,
    text: "Supports multiple languages",
    className: "ml-[280px]",
  },
  {
    icon: CheckIcon,
    text: "200 snippets compiled",
    className: "ml-[80px]",
  },
];

export const FEATURES = [
  {
    icon: GaugeIcon,
    title: "Faster Runtime",
    description: "Performs 150% faster than competitors.",
  },
  {
    icon: DollarSignIcon,
    title: "Free Forever",
    description: "No hidden charges, no credit card required.",
  },
  {
    icon: GithubIcon,
    title: "Open Source",
    description: "Source code is available on GitHub.",
  },
  {
    icon: CodeIcon,
    title: "Multiple Languages Support",
    description: "Supports 4+ languages and counting.",
  },
  {
    icon: BoxIcon,
    title: "Multiple Workers",
    description:
      "Multiple workers run simultaneously, minimizing or eliminating wait times.",
  },
];

export const LANGUAGES_CTA = [
  {
    title: "Python",
    description: "Write and execute Python code instantly—no setup needed!",
    icon: "languages/python.png",
    id: "python",
  },
  {
    title: "Java",
    description: "Craft, compile, and run Java code with ease!",
    icon: "languages/java.png",
    id: "java",
  },
  {
    title: "C",
    description: "Compile and run C code without any hassle!",
    icon: "languages/c.png",
    id: "c",
  },
  {
    title: "JavaScript",
    description: "Execute JavaScript code instantly with our online compiler!",
    icon: "languages/javascript.png",
    id: "javascript",
  },
];
