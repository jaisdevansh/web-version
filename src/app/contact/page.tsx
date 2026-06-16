'use client';

import { Mail, Phone, MapPin, MessageSquare, Send, ArrowRight, Loader2, Sparkles, Globe, ChevronDown, MessageCircle, User, Trash2, X, ArrowUp } from 'lucide-react';
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
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Network error. Could not connect to AI server.' }]);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans pb-20 overflow-hidden relative">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-gradient-to-tl from-blue-600/10 to-cyan-600/10 blur-[150px] pointer-events-none mix-blend-screen" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 z-10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          
          {/* App Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto mb-12 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl shadow-2xl text-left"
          >
            <div className="flex items-center gap-4">
              <div className="hidden">
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Looking for a smoother flow?</h3>
                <p className="text-white/70 text-sm font-light leading-relaxed">For the best experience and instant live support, please use the Entry Club mobile app.</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] text-sm shrink-0">
              Download App
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-white/80 tracking-[0.2em] uppercase">We're Online 24/7</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-extrabold text-white tracking-tighter mb-6"
          >
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Connect</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Have a bold idea, need help with a premium booking, or want to explore partnerships? Our elite team is ready to assist you.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Contact Information (Left Column) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-5/12 space-y-6"
          >
            {/* AI Chat Card */}
            <motion.div variants={itemVariants} className="group relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Chat</h3>
              <p className="text-white/50 text-sm mb-8 leading-relaxed font-light">Experience the future of support. Get instant, intelligent answers tailored to your Entry Club experience.</p>
              <button onClick={() => setIsChatModalOpen(true)} className="inline-flex items-center text-white bg-blue-600/20 hover:bg-blue-600 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group/btn shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                Start Chat <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Email Card */}
            <motion.div variants={itemVariants} className="group relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:scale-110 transition-transform duration-500">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Direct Email</h3>
              <p className="text-white/50 text-sm mb-8 leading-relaxed font-light">Prefer the classic way? Drop us an email and our human support team will respond within 24 hours.</p>
              <a href="mailto:info.zenbourg@gmail.com" className="inline-flex items-center text-white bg-purple-600/20 hover:bg-purple-600 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group/btn shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                info.zenbourg@gmail.com <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </motion.div>


          </motion.div>

          {/* Contact Form (Right Column) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="w-full lg:w-7/12"
          >
            <div className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-3xl h-full before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none">
              
              <div className="relative z-10 mb-12">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Drop us a line</h2>
                <p className="text-white/50 font-light">Fill out the form below. We promise to keep your data secure.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase group-focus-within:text-blue-400 transition-colors">First Name</label>
                    <input 
                      {...register('firstName')}
                      type="text" 
                      className={`w-full bg-transparent border-b-2 ${errors.firstName ? 'border-red-500/50' : 'border-white/10'} py-3 text-base text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20`}
                      placeholder="John"
                      disabled={isSubmitting}
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-2">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase group-focus-within:text-blue-400 transition-colors">Last Name</label>
                    <input 
                      {...register('lastName')}
                      type="text" 
                      className={`w-full bg-transparent border-b-2 ${errors.lastName ? 'border-red-500/50' : 'border-white/10'} py-3 text-base text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20`}
                      placeholder="Doe"
                      disabled={isSubmitting}
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-2">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase group-focus-within:text-purple-400 transition-colors">Email Address</label>
                  <input 
                    {...register('email')}
                    type="email" 
                    className={`w-full bg-transparent border-b-2 ${errors.email ? 'border-red-500/50' : 'border-white/10'} py-3 text-base text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/20`}
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>}
                </div>

                <div className="space-y-2 group relative z-20">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase group-focus-within:text-indigo-400 transition-colors">Subject</label>
                  <div 
                    onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full bg-transparent border-b-2 ${errors.subject ? 'border-red-500/50' : 'border-white/10'} py-3 text-base ${selectedSubject ? 'text-white' : 'text-white/20'} focus:outline-none focus:border-indigo-500 transition-all cursor-pointer flex items-center justify-between`}
                  >
                    <span>{currentLabel}</span>
                    <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
                        className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111111] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden z-50"
                      >
                        {subjects.map((sub, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setValue('subject', sub.value, { shouldValidate: true });
                              setIsDropdownOpen(false);
                            }}
                            className={`px-5 py-3.5 cursor-pointer transition-colors ${selectedSubject === sub.value ? 'bg-indigo-500/20 text-indigo-400 font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white font-light'}`}
                          >
                            {sub.label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {errors.subject && <p className="text-red-400 text-xs mt-2">{errors.subject.message}</p>}
                </div>

                <div className="space-y-2 group pt-4">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase group-focus-within:text-blue-400 transition-colors">Your Message</label>
                  <textarea 
                    {...register('message')}
                    rows={4}
                    className={`w-full bg-white/[0.02] border ${errors.message ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-5 text-base text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.04] transition-all placeholder:text-white/20 resize-none mt-2`}
                    placeholder="Tell us everything..."
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-xs mt-2">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative overflow-hidden bg-white text-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group/submit mt-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 translate-y-[100%] group-hover/submit:translate-y-0 transition-transform duration-300 ease-out" />
                  
                  <div className="relative z-10 flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Send Transmission
                        <Send className="w-5 h-5 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isChatModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl h-[80vh] max-h-[800px] flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">AI Support Chat</h2>
                    <p className="text-xs text-white/50">24/7 Intelligent Concierge</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-full transition-colors group" title="Clear Chat">
                    <Trash2 className="w-4 h-4 text-white/50 group-hover:text-white" />
                  </button>
                  <button onClick={() => setIsChatModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                    <X className="w-5 h-5 text-white/50 group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-gradient-to-b from-transparent to-white/[0.02]">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                      <MessageCircle className="w-8 h-8 text-blue-500 fill-blue-500/20" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">How can I help you today?</h3>
                    <p className="text-white/40 text-sm text-center max-w-sm leading-relaxed">
                      Ask me anything about Entry Club features, host registration, or ticketing support.
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#222222] border border-white/10' : 'bg-blue-500/20 border border-blue-500/30'}`}>
                          {msg.role === 'user' ? <User className="w-4 h-4 text-white/70" /> : <Sparkles className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' : 'bg-blue-600/10 text-blue-50 border border-blue-500/20 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-4 flex-row">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 w-fit h-10">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-6 pt-2 bg-transparent border-t border-white/5">
                <div className="relative bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-xl focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all flex items-center pr-1">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-transparent px-5 py-4 text-white focus:outline-none placeholder:text-white/30 text-sm"
                    placeholder="Type your message..."
                  />
                  <button onClick={handleSend} disabled={!input.trim() || isTyping} className="w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all shrink-0">
                    <ArrowUp className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-center text-[10px] text-white/30 mt-3 font-medium">
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
