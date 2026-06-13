'use client';

import { Mail, Phone, MapPin, MessageSquare, Send, ArrowRight, Loader2, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
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
              <div className="p-3 bg-white/5 rounded-full shrink-0">
                <Sparkles className="w-6 h-6 text-purple-400" />
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
            {/* AI Concierge Card */}
            <motion.div variants={itemVariants} className="group relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Concierge</h3>
              <p className="text-white/50 text-sm mb-8 leading-relaxed font-light">Experience the future of support. Get instant, intelligent answers tailored to your Entry Club experience.</p>
              <Link href="/settings/ai-concierge" className="inline-flex items-center text-white bg-blue-600/20 hover:bg-blue-600 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group/btn shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                Start Chat <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
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

            {/* Global Presence Card */}
            <motion.div variants={itemVariants} className="group relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-500">
              <div className="absolute right-[-20%] bottom-[-20%] opacity-10 group-hover:opacity-30 transition-opacity duration-700">
                <Globe className="w-64 h-64 text-white" strokeWidth={1} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 relative z-10">
                <MapPin className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Global Presence</h3>
              <p className="text-white/50 text-sm mb-2 relative z-10 font-light">Zenbourg Technologies HQ</p>
              <p className="text-white/70 text-sm font-medium relative z-10 mb-8">New Delhi, India</p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center text-white/70 hover:text-white font-medium text-sm transition-colors group/link relative z-10">
                View on Map
                <div className="w-8 h-[1px] bg-white/30 ml-3 group-hover/link:w-12 group-hover/link:bg-white transition-all duration-300"></div>
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

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase group-focus-within:text-indigo-400 transition-colors">Subject</label>
                  <select 
                    {...register('subject')}
                    className={`w-full bg-transparent border-b-2 ${errors.subject ? 'border-red-500/50' : 'border-white/10'} py-3 text-base text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer [&>option]:bg-[#0A0A0A]`}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled className="text-white/20">Select a topic...</option>
                    <option value="support">General Support</option>
                    <option value="booking">Booking Issue</option>
                    <option value="partnership">Partnership / Host Registration</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
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
    </div>
  );
}
