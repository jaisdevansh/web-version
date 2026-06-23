'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    question: "What is Entry Club?",
    answer: "Entry Club is a premium real-world community platform designed to help you discover events, meet like-minded people, and experience your city without overthinking."
  },
  {
    question: "Is Entry Club free to use?",
    answer: "Yes, downloading the app and discovering events is completely free. Some exclusive events or private clubs may have an entry fee or require premium membership."
  },
  {
    question: "Can I create my own plan on Entry Club?",
    answer: "Absolutely! You can easily host your own events or meetups, whether it's a casual coffee run or a large networking mixer, and invite the community."
  },
  {
    question: "Can I join communities on Entry Club?",
    answer: "Yes, you can join various interest-based clubs and communities to connect with people who share your vibe and passions."
  },
  {
    question: "Is Entry Club safe?",
    answer: "Safety is our top priority. Every profile and event goes through a rigorous verification process to ensure a trustworthy environment for all members."
  },
  {
    question: "Who is Entry Club for?",
    answer: "Entry Club is for anyone looking to step out, explore their city, make real connections, and experience life offline."
  },
  {
    question: "How do I find events near me?",
    answer: "Simply use the City Explorer on the home page or allow the app to access your location to see personalized recommendations."
  },
  {
    question: "What makes Entry Club different from other event apps?",
    answer: "Unlike generic ticketing platforms, Entry Club focuses on the people. It's a social-first ecosystem where the event is just the starting point for genuine connections."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#050505] py-24 px-4 md:px-8 relative border-t border-[#1a1a2e]">
      
      {/* Subtle Purple Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column - Heading */}
        <div className="lg:col-span-5 sticky top-24">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
            Frequently<br />Asked<br />Questions
          </h2>
          
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-2">Want to know more?</h3>
            <p className="text-white/80 text-lg mb-4">We're here to help.</p>
            <Link 
              href="/contact" 
              className="text-[#3B82F6] font-semibold text-lg hover:text-blue-400 transition-colors underline underline-offset-4"
            >
              Get in touch.
            </Link>
          </div>
        </div>

        {/* Right Column - Accordion */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className="bg-[#0a0a0f] border border-[#1a1a2e] rounded-2xl overflow-hidden transition-colors hover:bg-[#11111b]"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-6 flex justify-between items-center focus:outline-none"
              >
                <span className="text-white font-medium text-[17px] md:text-lg pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 text-white/50"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-400 text-base md:text-lg leading-relaxed border-t border-white/5 mt-2 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
