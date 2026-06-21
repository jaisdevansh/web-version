'use client';

import { Mail, MessageCircle, Sparkles, ArrowRight, Loader2, ChevronDown, User, Trash2, X, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginModal } from '@/components/shared/LoginModal';
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

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
    
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/support/support-chat', { message: userMsg });
      if (res.data?.success) {
        setMessages(prev => [...prev, { role: 'ai', text: res.data.data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'I encountered an error. Please try again.' }]);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setMessages(prev => [...prev, { role: 'ai', text: 'Session expired. Please log in again.' }]);
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
      const response = await api.post('/support/contact', data);
      if (response.data?.success || response.status === 200 || response.status === 201) {
        toast.success('Message sent successfully! We will get back to you soon.');
        reset();
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send message. Please check your connection and try again.');
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
    <div className="bg-[#000000] min-h-screen text-[#f5f5f7] font-sans selection:bg-[#0066cc]/30">
      
      {/* 1. Hero Section */}
      <section className="pt-24 md:pt-36 pb-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1e]/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-4 text-[#f5f5f7]">
              Contact our team.
            </h1>
            <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mb-12 font-medium">
              We're here to help you with premium bookings, partnerships, and support. Get in touch with us.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* Left Column (Cards) */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6">
              
              {/* AI Chat Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-[#1c1c1e]/50 border border-white/[0.05] hover:bg-[#1c1c1e] transition-colors duration-500 flex flex-col p-8 relative overflow-hidden rounded-[2rem] backdrop-blur-2xl"
              >
                 <div className="w-12 h-12 rounded-full bg-[#0066cc]/10 flex items-center justify-center mb-6 border border-[#0066cc]/20">
                   <Sparkles className="w-6 h-6 text-[#2997ff]" />
                 </div>
                 <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-3 tracking-tight">AI Support Chat</h3>
                 <p className="text-[#86868b] text-[15px] leading-relaxed mb-8 max-w-sm">
                   Experience the future of support. Get instant, intelligent answers tailored to your Entry Club experience.
                 </p>
                 <button onClick={() => setIsChatModalOpen(true)} className="mt-auto self-start text-[#2997ff] flex items-center font-medium hover:text-[#0066cc] transition-colors group">
                   Start a conversation <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                 </button>
              </motion.div>

              {/* Email Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-[#1c1c1e]/50 border border-white/[0.05] hover:bg-[#1c1c1e] transition-colors duration-500 flex flex-col p-8 relative overflow-hidden rounded-[2rem] backdrop-blur-2xl"
              >
                 <div className="w-12 h-12 rounded-full bg-[#bf5af2]/10 flex items-center justify-center mb-6 border border-[#bf5af2]/20">
                   <Mail className="w-6 h-6 text-[#bf5af2]" />
                 </div>
                 <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-3 tracking-tight">Direct Email</h3>
                 <p className="text-[#86868b] text-[15px] leading-relaxed mb-8 max-w-sm">
                   Prefer the classic way? Drop us an email and our human support team will respond within 24 hours.
                 </p>
                 <button 
                   onClick={(e) => {
                     e.preventDefault();
                     if (!isAuthenticated) {
                       setIsLoginModalOpen(true);
                     } else {
                       router.push('/dashboard/support');
                     }
                   }}
                   className="mt-auto self-start text-[#bf5af2] flex items-center font-medium hover:text-[#9c3ed9] transition-colors group"
                 >
                   Send an email <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                 </button>
              </motion.div>

            </div>

            {/* Right Column (Form) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-7/12"
            >
              <div className="bg-[#1c1c1e]/40 border border-white/[0.05] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl h-full flex flex-col justify-center shadow-2xl">
                
                <div className="mb-10">
                  <h2 className="text-3xl font-semibold text-[#f5f5f7] tracking-tight mb-2">Send us a message</h2>
                  <p className="text-[#86868b] text-[15px]">Fill out the form below. We promise to keep your data secure.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#86868b] ml-1">First Name</label>
                      <input 
                        {...register('firstName')}
                        type="text" 
                        className={`w-full bg-[#2c2c2e]/50 border ${errors.firstName ? 'border-[#ff3b30]' : 'border-white/[0.08]'} rounded-2xl px-4 py-3.5 text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#2997ff]/50 focus:border-[#2997ff] transition-all placeholder:text-[#86868b]/50`}
                        placeholder="John"
                        disabled={isSubmitting}
                      />
                      {errors.firstName && <p className="text-[#ff3b30] text-[12px] ml-1 mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#86868b] ml-1">Last Name</label>
                      <input 
                        {...register('lastName')}
                        type="text" 
                        className={`w-full bg-[#2c2c2e]/50 border ${errors.lastName ? 'border-[#ff3b30]' : 'border-white/[0.08]'} rounded-2xl px-4 py-3.5 text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#2997ff]/50 focus:border-[#2997ff] transition-all placeholder:text-[#86868b]/50`}
                        placeholder="Doe"
                        disabled={isSubmitting}
                      />
                      {errors.lastName && <p className="text-[#ff3b30] text-[12px] ml-1 mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#86868b] ml-1">Email Address</label>
                    <input 
                      {...register('email')}
                      type="email" 
                      className={`w-full bg-[#2c2c2e]/50 border ${errors.email ? 'border-[#ff3b30]' : 'border-white/[0.08]'} rounded-2xl px-4 py-3.5 text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#2997ff]/50 focus:border-[#2997ff] transition-all placeholder:text-[#86868b]/50`}
                      placeholder="john@example.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-[#ff3b30] text-[12px] ml-1 mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2 relative z-20">
                    <label className="text-[13px] font-medium text-[#86868b] ml-1">Subject</label>
                    <div 
                      onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full bg-[#2c2c2e]/50 border ${errors.subject ? 'border-[#ff3b30]' : 'border-white/[0.08]'} rounded-2xl px-4 py-3.5 ${selectedSubject ? 'text-[#f5f5f7]' : 'text-[#86868b]/50'} focus-within:ring-2 focus-within:ring-[#2997ff]/50 focus-within:border-[#2997ff] transition-all cursor-pointer flex items-center justify-between`}
                    >
                      <span>{currentLabel}</span>
                      <ChevronDown className={`w-5 h-5 text-[#86868b] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {/* Hidden input */}
                    <input type="hidden" {...register('subject')} />

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#2c2c2e]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                          {subjects.map((sub, idx) => (
                            <div 
                              key={idx}
                              onClick={() => {
                                setValue('subject', sub.value, { shouldValidate: true });
                                setIsDropdownOpen(false);
                              }}
                              className={`px-4 py-3 cursor-pointer transition-colors text-[15px] ${selectedSubject === sub.value ? 'bg-[#2997ff] text-white font-medium' : 'text-[#f5f5f7] hover:bg-white/10'}`}
                            >
                              {sub.label}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {errors.subject && <p className="text-[#ff3b30] text-[12px] ml-1 mt-1">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#86868b] ml-1">Your Message</label>
                    <textarea 
                      {...register('message')}
                      rows={5}
                      className={`w-full bg-[#2c2c2e]/50 border ${errors.message ? 'border-[#ff3b30]' : 'border-white/[0.08]'} rounded-2xl px-4 py-3.5 text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#2997ff]/50 focus:border-[#2997ff] transition-all placeholder:text-[#86868b]/50 resize-none`}
                      placeholder="How can we help?"
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && <p className="text-[#ff3b30] text-[12px] ml-1 mt-1">{errors.message.message}</p>}
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#f5f5f7] hover:bg-white text-black font-semibold text-[15px] py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                    >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                          </>
                        )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1c1c1e] border border-white/[0.05] rounded-[2.5rem] shadow-2xl w-full max-w-2xl h-[80vh] max-h-[800px] flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.05] bg-[#1c1c1e]/90 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 flex items-center justify-center border border-[#0066cc]/20">
                    <Sparkles className="w-5 h-5 text-[#2997ff]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#f5f5f7] tracking-tight">AI Concierge</h2>
                    <p className="text-[13px] text-[#86868b]">Always online to assist you</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-full transition-colors group" title="Clear Chat">
                    <Trash2 className="w-5 h-5 text-[#86868b] group-hover:text-white" />
                  </button>
                  <button onClick={() => setIsChatModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                    <X className="w-5 h-5 text-[#86868b] group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-[#000000]">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-10">
                    <div className="w-16 h-16 rounded-full bg-[#2997ff]/10 flex items-center justify-center mb-6">
                      <MessageCircle className="w-8 h-8 text-[#2997ff]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">How can I help you today?</h3>
                    <p className="text-[#86868b] text-[15px] text-center max-w-sm leading-relaxed">
                      Ask me anything about Entry Club features, host registration, or ticketing support.
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#2c2c2e]' : 'bg-[#2997ff]/10'}`}>
                          {msg.role === 'user' ? <User className="w-4 h-4 text-[#86868b]" /> : <Sparkles className="w-4 h-4 text-[#2997ff]" />}
                        </div>
                        <div className={`max-w-[75%] px-5 py-3 text-[15px] leading-relaxed ${msg.role === 'user' ? 'bg-[#2997ff] text-white rounded-[1.25rem] rounded-tr-sm' : 'bg-[#2c2c2e] text-[#f5f5f7] rounded-[1.25rem] rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3 flex-row">
                        <div className="w-8 h-8 rounded-full bg-[#2997ff]/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-[#2997ff]" />
                        </div>
                        <div className="bg-[#2c2c2e] rounded-[1.25rem] rounded-tl-sm px-5 py-4 flex items-center gap-1.5 w-fit h-12">
                          <div className="w-1.5 h-1.5 bg-[#86868b] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 bg-[#86868b] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 bg-[#86868b] rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-[#1c1c1e] border-t border-white/[0.05]">
                <div className="relative bg-[#2c2c2e]/50 border border-white/[0.05] rounded-full overflow-hidden focus-within:bg-[#2c2c2e] transition-all flex items-center p-1.5">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-transparent px-4 py-2.5 text-[15px] text-[#f5f5f7] focus:outline-none placeholder:text-[#86868b]"
                    placeholder="Type a message..."
                  />
                  <button onClick={handleSend} disabled={!input.trim() || isTyping} className="w-10 h-10 bg-[#2997ff] hover:bg-[#007aff] disabled:bg-[#2997ff]/30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors shrink-0">
                    <ArrowUp className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={() => {
          setIsLoginModalOpen(false);
        }} 
      />
    </div>
  );
}
