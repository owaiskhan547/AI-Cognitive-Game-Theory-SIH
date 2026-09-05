"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does SmritiCare help with dementia?",
    answer:
      "SmritiCare uses AI-powered cognitive games, personalized memory exercises, and an intelligent companion to help stimulate cognitive function. Regular engagement has been shown to slow cognitive decline and improve quality of life.",
  },
  {
    question: "Is the platform safe for elderly users?",
    answer:
      "Absolutely. SmritiCare is designed with senior-friendly interfaces — large text, simple navigation, high contrast, and calm visual design. All data is encrypted and HIPAA-compliant.",
  },
  {
    question: "What can caregivers monitor?",
    answer:
      "Caregivers have access to comprehensive dashboards showing cognitive progress trends, medication adherence, game performance, daily activity logs, and can set up medication reminders and alerts.",
  },
  {
    question: "Do I need technical knowledge to use it?",
    answer:
      "Not at all. The patient interface is designed to be as simple as possible — just tap large, clearly labeled buttons. The AI assistant also supports voice interaction for hands-free use.",
  },
  {
    question: "Is there an emergency feature?",
    answer:
      "Yes. Patients have a prominent SOS button that immediately alerts their designated caregiver and emergency contacts with their location and status.",
  },
]

export function FAQ() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative py-24 lg:py-32 border-t border-border" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-display mb-4">
            Frequently asked <span className="text-gradient-lime">questions</span>
          </h2>
          <p className="text-muted-foreground">Everything you need to know about SmritiCare</p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card/30"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
