import { Button, buttonVariants } from "@/components/ui/button";
import { FEATURES, HERO_PILLS, LANGUAGES_CTA } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  GaugeIcon,
  LucideIcon,
  MenuIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="flex justify-between p-3 md:p-6 items-center max-w-screen-xl mx-auto w-full">
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
      <Button className="max-lg:hidden rounded">Code Now</Button>
      <Button variant="ghost" className="lg:hidden">
        <MenuIcon className="size-10" />
      </Button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Flow />
      <Languages />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <div className="flex flex-col">
      <div className="relative max-w-screen-xl mx-auto w-full">
        <div className="absolute gr2 w-[1038px] h-[993px] md:w-[1596px] md:h-[1527px] top-[-139px] md:-top-[580px] lg:-top-[480px] -right-[608px] md:right-[-864px] lg:right-[-564px] rounded-full -z-10" />
      </div>

      <div className="max-w-screen-xl mx-auto w-full my-20 flex gap-10 relative md:justify-center lg:justify-start">
        <div className="max-w-2xl p-6 space-y-4 shrink-0 w-full md:text-center md:items-center lg:items-start lg:text-start flex flex-col">
          <div className="rounded-full px-4 py-1 gr3 text-sm border-primary border w-fit">
            Open source code compiler
          </div>
          <h1 className="lg:text-[80px] text-[64px] leading-[1] font-extrabold">
            Compile your Code on the web.
          </h1>
          <p className="text-foreground2 lg:text-xl">
            Code compiler is a free tool which helps to compile and run the code
            on the web.
          </p>
          <div className="flex gap-4">
            <Button>Compile Now</Button>
            <Button variant="outline">View on Github</Button>
          </div>
        </div>
        <div className="hidden lg:block space-y-16">
          {HERO_PILLS.map(({ icon: Icon, text, className }, index) => (
            <>
              <div
                className={cn("gr5 p-0.5 w-fit pill-r", className)}
                key={text}
              >
                <div className="pill-bg pill-r">
                  <div className="pill-gr p-[16px] pill-r flex gap-2 items-center">
                    <Icon className="size-6" />
                    <span>{text}</span>
                  </div>
                </div>
              </div>
              {index < HERO_PILLS.length - 1 && (
                <div
                  className={cn(
                    "gr4 h-px w-[400px] -translate-x-[40px]",
                    className,
                  )}
                />
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

function Heading({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center relative">
      <div className="flex items-center text-4xl lg:text-6xl font-bold">
        <span className="text-primary select-none">{"<"}</span>
        <h1 className="">{text}</h1>
        <span className="text-primary select-none">{"/>"}</span>
      </div>
      <div className="gr4 mt-4 h-px absolute w-[140%] -bottom-4" />
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="gr5 p-0.5 rounded-md max-w-[560px]">
      <div className="gr6 rounded-md flex gap-2 p-4">
        <Icon className="h-12 w-12" strokeWidth={1} />
        <div className="flex flex-col gap-1">
          <h4 className="font-bold">{title}</h4>
          <p className="text-foreground2 leading-[1]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="flex flex-col items-center mt-40 relative max-w-screen-xl mx-auto overflow-visible">
      <div className="gr2 -z-10 -left-[256px] top-[-245px] w-[1418px] h-[1287px] absolute" />
      <Heading text="Features" />
      <div className="flex gap-16 items-center mt-20">
        <div className="flex flex-col gap-4 h-fit">
          {FEATURES.map(({ icon, title, description }) => (
            <FeatureCard
              key={title}
              icon={icon}
              title={title}
              description={description}
            />
          ))}
        </div>
        <div className="relative h-[540px] w-[852px]">
          <div className="absolute h-[540px] w-[1280px] flex items-center rounded-3xl overflow-hidden border-primary/40 border-2 p-4">
            <img
              src="features-screenshot.png"
              className="w-full h-full object-cover object-left-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Flow() {
  return (
    <div className="flex flex-col items-center mt-60 my-40">
      <Heading text="Flow" />
      <div className="grid grid-cols-2 grid-rows-2 w-full max-w-screen-xl mt-20 gap-8">
        {/* Step 1: Write your code */}
        <div className="border border-primary flex rounded-2xl flex-col p-10 col-span-2 bg-[#0D011C] relative overflow-hidden">
          <div className="gr7 absolute w-[913px] h-[889px] -left-[197px] -top-[354px] pointer-events-none" />
          <div className="flex gap-20">
            <div className="flex flex-col items-start gap-6">
              <span className="text-foreground2 font-semibold">Step 1</span>
              <h3 className="text-8xl font-extrabold leading-[100%] mt-6">
                Write
                <br />
                Your
                <br />
                Code.
              </h3>
              <Button size="lg">Code Now</Button>
            </div>
            <div className="relative w-[825px] h-[440px]">
              <div className="absolute">
                <div className="gr7 w-[913px] h-[890px] right-[-409px] bottom-[-247px] absolute z-10 pointer-events-none" />
                <img
                  src="example-input.png"
                  alt=""
                  className="rounded-3xl border-primary/40 border h-full pointer-events-none"
                />
                <img
                  src="example-output.png"
                  alt=""
                  className="rounded-3xl border-purple-800/40 shadow-[0_0_10px_4px] shadow-black/40 border absolute left-40 -top-20 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Select a Language */}
        <div className="border border-primary flex rounded-2xl flex-col p-10 bg-[#0D011C] relative overflow-hidden gap-4 isolate">
          <div className="gr7 w-[913px] h-[889px] -left-[353px] -bottom-[200px] absolute -z-10" />
          <div className="gr7 w-[913px] h-[889px] -right-[412px] -bottom-[289px] absolute -z-10" />
          <span className="text-foreground2 font-semibold">Step 2</span>
          <span className="font-bold text-2xl">Select a Language</span>
          <img src="languages-graph.png" className="my-auto" />
          <span className="text-gray-400">
            Select your preferred programming language from our list. We support
            Python, JavaScript, C, and more!
          </span>
        </div>

        {/* Step 3: Compile your code */}
        <div className="border border-primary flex rounded-2xl flex-col p-10 bg-[#0D011C] relative overflow-hidden gap-4 isolate">
          <div className="gr7 w-[913px] h-[889px] -left-[353px] -bottom-[200px] absolute -z-10" />
          <div className="gr7 w-[913px] h-[889px] -right-[412px] -bottom-[289px] absolute -z-10" />
          <span className="text-foreground2 font-semibold">Step 3</span>
          <span className="font-bold text-2xl">Run & Get Output</span>
          <img src="run-button.png" className="w-[1200px] my-auto shrink-0" />
          <span className="text-gray-400">
            Click Run to execute your code instantly. See real-time output in
            the console.
          </span>
        </div>
      </div>
    </div>
  );
}

function Languages() {
  return (
    <div className="flex flex-col max-w-screen-xl mx-auto w-full items-center relative">
      <div className="gr2 absolute w-[1100px] h-[1000px] -right-1/4 -top-full" />
      <Heading text="Languages" />
      <div className="grid grid-cols-4 mt-20 gap-4">
        {LANGUAGES_CTA.map((lang) => (
          <div
            key={lang.icon}
            className="border-primary/40 gr8 border rounded-lg p-4 relative overflow-hidden"
          >
            <div className="gr9 w-[170px] h-[140px] absolute -left-[21px] -top-[15px] rotate-[5deg]" />
            <div className="gr2 w-[404px] h-[394px] absolute -right-[136px] -top-[152px]" />
            <div className="gr2 w-[382px] h-[126px] absolute -left-[159px] -bottom-[52px]" />
            <img src={lang.icon} alt="" className="w-[80px]" />
            <div className="mt-6">
              <h3 className="font-bold text-2xl">{lang.title}</h3>
              <p className="text-foreground2 mt-1">{lang.description}</p>
              <Link
                href={`/compiler/?lang=${lang.id}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-4 w-full inline-flex justify-center size-12 p-0 items-center rounded-full text-primary",
                )}
              >
                <ChevronRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mx-auto w-full py-10 max-w-screen-xl flex justify-between mt-20">
      <Link href="/" className="font-bold text-xl">
        Code Compiler
      </Link>
      <Link href="" className="inline-flex items-center gap-2">
        <StarIcon className="size-6" />
        <span>Star us on github</span>
      </Link>
    </footer>
  );
}
