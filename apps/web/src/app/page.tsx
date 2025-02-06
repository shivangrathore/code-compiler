import { Button } from "@/components/ui/button";
import { HERO_PILLS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
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
    </div>
  );
}

export function Hero() {
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
                className={cn("pill-border w-fit pill-r", className)}
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

function Features() {}
