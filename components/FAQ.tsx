"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What exactly is a Revenue Blueprint?",
    answer:
      "A Blueprint is a fully custom growth roadmap built around your specific business — not a generic template. It includes a deep analysis of your current strengths and gaps, market data for your city and trade, a phased plan from your current revenue to your goal, and your top 9 marketing channels ranked by ROI for your specific situation. Most owners tell us it's the clearest picture they've ever had of where their business actually stands and exactly what to do next.",
  },
  {
    question: "Who is Surge AI built for?",
    answer:
      "Home service business owners doing $500K–$10M in annual revenue who want a real plan — not someone to take over. Our sweet spot is HVAC, plumbing, roofing, restoration, electrical, landscaping, pest control, and cleaning. Any trade-based business with real revenue goals and the drive to execute. If you're happy at your current size, we're probably not the right fit.",
  },
  {
    question: "How is this different from a regular marketing agency?",
    answer:
      "Three things. First, we start with a Blueprint — you understand the full strategy before committing to anything ongoing. Second, you stay in control — the Blueprint is yours, and you decide how involved we get in execution. Third, we tie everything to revenue and booked jobs, not traffic, impressions, or click-through rates. If a channel isn't producing real work, we say so.",
  },
  {
    question: "How fast will I see results?",
    answer:
      "The Blueprint Snapshot is ready in 60 seconds. The full Blueprint is delivered in 48 hours. For quick-win channels like Google LSA and referral partner outreach, most clients see new leads within the first 30 days of execution. SEO and AI search visibility compounds over 90–180 days. We sequence the plan so you have early momentum without sacrificing long-term growth.",
  },
  {
    question: "Do I need to commit to a monthly retainer?",
    answer:
      "No. The Blueprint ($499) is a standalone product — you get the full roadmap and one review call with zero strings attached. If you want ongoing support after that, both options are month-to-month with 30-day cancellation. No annual lock-ins, ever.",
  },
  {
    question: "What does the AI actually do in this process?",
    answer:
      "Claude (Anthropic's AI model) analyzes your intake data, cross-references it with current industry benchmarks, competitor positioning in your market, and best practices for your trade and geography — then synthesizes a custom Blueprint in hours instead of weeks. We then review and refine it with you directly. AI does the research and synthesis at speed; human judgment and your business context shape the final strategy.",
  },
  {
    question: "I'm not tech-savvy. Will I understand the Blueprint?",
    answer:
      "Yes. We write it for contractors, not marketers. Plain English, specific action steps, no jargon. If you can read a quote sheet, you can read the Blueprint. We also walk through it with you on a call so nothing gets lost.",
  },
  {
    question: "I've been burned by agencies before. How is this different?",
    answer:
      "The biggest difference: you own everything. The Blueprint is yours to keep, use, or take to whoever you want. We don't hold your Google Ads account hostage, we don't lock you into a 12-month contract, and we don't obscure what we're doing. You'll know exactly what the plan is and why — from day one.",
  },
  {
    question: "What if my area is already competitive?",
    answer:
      "Competitive markets are actually where we do our best work. There's more search volume, more room to optimize, and usually more contractors running mediocre marketing — which means better positioning for the ones who get it right. The Blueprint will tell you exactly what the gap looks like in your market and the specific moves to take advantage of it.",
  },
];

function FAQItem({
  faq,
  index,
}: {
  faq: (typeof faqs)[0];
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-4 p-6 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-[#0A1628] leading-snug">
          {faq.question}
        </span>
        <div className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center mt-0.5">
          {isOpen ? (
            <Minus className="w-3 h-3 text-[#00D4C8]" />
          ) : (
            <Plus className="w-3 h-3 text-gray-400" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed bg-white">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="faq"
      className="section-light py-24 sm:py-32"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] leading-tight">
            Questions we get every time.
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            Straight answers. No sales fluff.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.question} faq={faq} index={index} />
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 text-center p-8 rounded-2xl border border-dashed border-gray-300 bg-white"
        >
          <p className="text-gray-600 text-sm mb-3">Have a question we didn't answer?</p>
          <a
            href="#contact"
            className="text-[#0A1628] hover:text-[#0d1f35] font-semibold text-sm underline-offset-4 hover:underline transition-colors"
          >
            Ask us directly &rarr;
          </a>
        </motion.div>
      </div>
    </section>
  );
}
