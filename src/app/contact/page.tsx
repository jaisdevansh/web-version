'use client';

import { Mail, Phone, MapPin, MessageSquare, Send, ArrowRight, Loader2, Sparkles, Globe, ChevronDown, MessageCircle, User, Trash2, X, ArrowUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';

const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Chatbot State
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatModalOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatModalOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/api/v1/support/support-chat', { message: userMsg });
      if (res.data?.success) {
        setMessages(prev => [...prev, { role: 'ai', text: res.data.data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'I encountered an error. Please try again.' }]);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setMessages(prev => [...prev, { role: 'ai', text: 'Please log in to your Entry Club account to use the Elite AI Support Chat.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Network error. Could not connect to AI server.' }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => setMessages([]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSubject = watch('subject');
  const subjects = [
    { value: "support", label: "General Support" },
    { value: "booking", label: "Booking Issue" },
    { value: "partnership", label: "Partnership / Host Registration" },
    { value: "feedback", label: "Feedback & Suggestions" }
  ];
  const currentLabel = subjects.find(s => s.value === selectedSubject)?.label || "Select a topic...";

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-blue-500/30">
      
      {/* 1. Hero Section */}
      <section className="bg-black pt-20 md:pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1536px]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 mb-8 mt-4 md:mt-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-white/80 tracking-[0.2em] uppercase">We're Online 24/7</span>
          </div>

          <h1 className="text-6xl md:text-[128px] leading-[0.9] font-black uppercase tracking-tighter mb-8 text-white max-w-7xl">
            Let's <span className="italic font-light text-blue-500">Connect</span>
          </h1>
          <p className="text-lg md:text-[18px] text-gray-400 max-w-[800px] mb-12">
            Have a bold idea, need help with a premium booking, or want to explore partnerships? Our elite team is ready to assist you.
          </p>

          <div className="max-w-3xl bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-left hover:border-blue-500/30 transition-colors duration-500">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Looking for a smoother flow?</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">For the best experience and instant live support, please use the Entry Club mobile app.</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all text-sm shrink-0">
              Download App
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-black pb-32">
        <div className="container mx-auto px-4 max-w-[1536px]">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-[96px]">
            
            {/* Left Column (Cards) */}
            <div className="w-full lg:w-5/12 flex flex-col gap-8">
              
              {/* AI Chat Card */}
              <div className="group w-full bg-[#111] border border-white/5 hover:border-blue-500/30 transition-colors duration-500 flex flex-col p-8 md:p-12 relative overflow-hidden rounded-xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                   <Sparkles className="w-8 h-8 text-blue-500" />
                 </div>
                 <h3 className="text-3xl font-black uppercase text-white mb-4 tracking-tight">AI Support Chat</h3>
                 <p className="text-gray-400 text-[16px] leading-relaxed mb-10 max-w-sm font-light">
                   Experience the future of support. Get instant, intelligent answers tailored to your Entry Club experience.
                 </p>
                 <button onClick={() => setIsChatModalOpen(true)} className="inline-flex items-center text-white bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 hover:border-blue-600 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 w-max group/btn">
                   Start Chat <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>

              {/* Email Card */}
              <div className="group w-full bg-[#111] border border-white/5 hover:border-purple-500/30 transition-colors duration-500 flex flex-col p-8 md:p-12 relative overflow-hidden rounded-xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                   <Mail className="w-8 h-8 text-purple-400" />
                 </div>
                 <h3 className="text-3xl font-black uppercase text-white mb-4 tracking-tight">Direct Email</h3>
                 <p className="text-gray-400 text-[16px] leading-relaxed mb-10 max-w-sm font-light">
                   Prefer the classic way? Drop us an email and our human support team will respond within 24 hours.
                 </p>
                 <a href="mailto:info.zenbourg@gmail.com" className="inline-flex items-center text-white bg-purple-600/10 hover:bg-purple-600 border border-purple-500/20 hover:border-purple-600 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 w-max group/btn">
                   info.zenbourg@gmail.com <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                 </a>
              </div>

            </div>

            {/* Right Column (Form) */}
            <div className="w-full lg:w-7/12">
              <div className="bg-[#111] border border-white/5 hover:border-blue-500/30 transition-colors duration-500 rounded-3xl p-8 md:p-16 relative overflow-hidden h-full flex flex-col justify-center">
                
                <div className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">Drop Us A Line</h2>
                  <p className="text-gray-400 font-light text-lg">Fill out the form below. We promise to keep your data secure.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3 group">
                      <label className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase group-focus-within:text-blue-500 transition-colors">First Name</label>
                      <input 
                        {...register('firstName')}
                        type="text" 
                        className={`w-full bg-transparent border-b-2 ${errors.firstName ? 'border-red-500/50' : 'border-white/10'} py-3 text-lg text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700`}
                        placeholder="John"
                        disabled={isSubmitting}
                      />
                      {errors.firstName && <p className="text-red-400 text-xs mt-2">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-3 group">
                      <label className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase group-focus-within:text-blue-500 transition-colors">Last Name</label>
                      <input 
                        {...register('lastName')}
                        type="text" 
                        className={`w-full bg-transparent border-b-2 ${errors.lastName ? 'border-red-500/50' : 'border-white/10'} py-3 text-lg text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700`}
                        placeholder="Doe"
                        disabled={isSubmitting}
                      />
                      {errors.lastName && <p className="text-red-400 text-xs mt-2">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase group-focus-within:text-purple-500 transition-colors">Email Address</label>
                    <input 
                      {...register('email')}
                      type="email" 
                      className={`w-full bg-transparent border-b-2 ${errors.email ? 'border-red-500/50' : 'border-white/10'} py-3 text-lg text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-700`}
                      placeholder="john@example.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-3 group relative z-20">
                    <label className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase group-focus-within:text-blue-500 transition-colors">Subject</label>
                    <div 
                      onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full bg-transparent border-b-2 ${errors.subject ? 'border-red-500/50' : 'border-white/10'} py-3 text-lg ${selectedSubject ? 'text-white' : 'text-gray-700'} focus:outline-none focus:border-blue-500 transition-all cursor-pointer flex items-center justify-between`}
                    >
                      <span>{currentLabel}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {/* Hidden input for react-hook-form to register */}
                    <input type="hidden" {...register('subject')} />

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#181817] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                          {subjects.map((sub, idx) => (
                            <div 
                              key={idx}
                              onClick={() => {
                                setValue('subject', sub.value, { shouldValidate: true });
                                setIsDropdownOpen(false);
                              }}
                              className={`px-6 py-4 cursor-pointer transition-colors ${selectedSubject === sub.value ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-gray-400 hover:bg-[#222] hover:text-white font-light'}`}
                            >
                              {sub.label}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {errors.subject && <p className="text-red-400 text-xs mt-2">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-3 group pt-4">
                    <label className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase group-focus-within:text-blue-500 transition-colors">Your Message</label>
                    <textarea 
                      {...register('message')}
                      rows={5}
                      className={`w-full bg-[#181817] border ${errors.message ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-6 text-lg text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700 resize-none mt-2`}
                      placeholder="Tell us everything..."
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && <p className="text-red-400 text-xs mt-2">{errors.message.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-[32px] py-[28px] uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          Send Transmission
                          <ArrowUpRight className="w-5 h-5 ml-2" strokeWidth={3} />
                        </>
                      )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isChatModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-2xl h-[80vh] max-h-[800px] flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#181817] relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">AI Support Chat</h2>
                    <p className="text-sm text-gray-500">24/7 Intelligent Concierge</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={clearChat} className="p-2 hover:bg-white/5 rounded-full transition-colors group" title="Clear Chat">
                    <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-white" />
                  </button>
                  <button onClick={() => setIsChatModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                    <X className="w-6 h-6 text-gray-500 group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-black">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-10">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                      <MessageCircle className="w-10 h-10 text-blue-500 fill-blue-500/20" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">How can I help you today?</h3>
                    <p className="text-gray-500 text-[16px] text-center max-w-sm leading-relaxed">
                      Ask me anything about Entry Club features, host registration, or ticketing support.
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#181817] border border-white/5' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                          {msg.role === 'user' ? <User className="w-5 h-5 text-gray-400" /> : <Sparkles className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl px-6 py-4 text-[16px] leading-relaxed ${msg.role === 'user' ? 'bg-[#181817] text-white rounded-tr-sm border border-white/5' : 'bg-blue-600/10 text-blue-50 border border-blue-500/20 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-4 flex-row">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-1.5 w-fit h-14">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-6 pt-0 bg-black">
                <div className="relative bg-[#181817] border border-white/5 rounded-2xl overflow-hidden focus-within:border-blue-500/50 transition-all flex items-center pr-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-transparent px-6 py-5 text-lg text-white focus:outline-none placeholder:text-gray-600"
                    placeholder="Type your message..."
                  />
                  <button onClick={handleSend} disabled={!input.trim() || isTyping} className="w-12 h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all shrink-0">
                    <ArrowUp className="w-6 h-6 text-white" />
                  </button>
                </div>
                <p className="text-center text-xs text-gray-600 mt-4 font-medium">
                  AI Chat may produce inaccurate information about people, places, or facts.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
