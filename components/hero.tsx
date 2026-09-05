import { Button } from "@/components/ui/button"
import { motion, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"

const trustedLogos = [
  { name: "AIIMS Delhi", text: "AIIMS Delhi" },
  { name: "NIMHANS", text: "NIMHANS" },
  { name: "WHO", text: "WHO" },
  { name: "ICMR", text: "ICMR" },
  { name: "SIH 2026", text: "SIH 2026" },
]

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden" id="features">
      <div className="flex-1 flex items-center justify-center pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-display text-balance mb-6 leading-[1.1]"
          >
            <span className="text-gradient-lime">AI-powered cognitive care</span>
            <br />
            <span className="text-foreground">for your loved ones</span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed px-2"
          >
            SmritiCare helps elderly patients with dementia through personalized cognitive games, medication reminders, memory assistance, and AI companionship — while giving caregivers real-time insights into their loved one's progress.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="xl" rounded="full" className="w-full sm:w-auto min-w-[200px]" asChild>
              <Link to="/login">
                I'm a Patient
              </Link>
            </Button>
            <Button variant="outline" size="xl" rounded="full" className="bg-transparent w-full sm:w-auto min-w-[200px]" asChild>
              <Link to="/login">
                I'm a Caregiver
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="relative z-10 w-full py-8 sm:py-10 border-t border-border/30 bg-background/80 backdrop-blur-sm mt-auto"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs sm:text-sm text-muted-foreground/60 mb-4 sm:mb-6 text-center">
            Supported by leading healthcare institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-3 sm:gap-y-4">
            {trustedLogos.map((logo) => (
              <span
                key={logo.name}
                className="text-base sm:text-lg md:text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
              >
                {logo.text}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
