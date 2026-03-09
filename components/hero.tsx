import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[26rem] font-display font-bold text-foreground/[0.03] leading-none tracking-tighter">
          STREATER
        </span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-24 pb-16 lg:pt-0 lg:pb-0">
        {/* Left content */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="inline-block w-8 h-[2px] bg-primary" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
              New Arrival
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-[0.9] tracking-tight text-foreground">
            New
            <br />
            <span className="text-primary">Sneakers</span>
          </h1>

          <div className="mt-2 space-y-1">
            <p className="text-lg text-muted-foreground font-medium">
              {"Streater Impossible'20"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Easy. Airy. Universal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/trends">
                Shop now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/collections">Explore collections</Link>
            </Button>
          </div>
        </div>

        {/* Right image */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-primary/10 blur-3xl" />
          <Image
            src="/images/hero-sneaker.png"
            alt="Featured Streater Sneaker"
            width={700}
            height={500}
            className="relative z-10 w-full max-w-lg lg:max-w-xl object-contain drop-shadow-2xl hover:scale-95 transition-transform duration-500 cursor-pointer motion-safe:animate-[float_6s_ease-in-out_infinite]"
            priority
          />
        </div>
      </div>

      {/* Side vertical text */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <span className="text-xs text-muted-foreground tracking-[0.3em] uppercase [writing-mode:vertical-lr] rotate-180">
          {"See What's New"}
        </span>
        <span className="w-[1px] h-16 bg-muted-foreground/30" />
      </div>
    </section>
  )
}
