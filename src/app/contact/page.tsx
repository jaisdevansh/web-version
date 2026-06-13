import { Mail, Phone, MapPin, MessageSquare, Send, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';

export const metadata = {
  title: 'Contact Us | Entry Club',
  description: 'Get in touch with the Entry Club team for support, inquiries, and partnerships.',
};

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans pb-20">
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-white/80 tracking-widest uppercase">We're Online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Have questions about Entry Club, need help with a booking, or want to partner with us? Our team is here to help 24/7.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Contact Information (Left Column) */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-white/15 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100" />
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 relative z-10 border border-blue-500/20">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Chat with Support</h3>
              <p className="text-white/50 text-sm mb-6 relative z-10">Get instant answers from our AI Concierge or connect with a human agent.</p>
              <Link href="/settings/ai-concierge" className="inline-flex items-center text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors group/link relative z-10">
                Start a conversation
                <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-white/15 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100" />
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 relative z-10 border border-indigo-500/20">
                <Mail className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Email Us</h3>
              <p className="text-white/50 text-sm mb-6 relative z-10">Drop us an email and we'll get back to you within 24 hours.</p>
              <a href="mailto:info.zenbourg@gmail.com" className="inline-flex items-center text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors group/link relative z-10">
                info.zenbourg@gmail.com
                <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-white/15 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100" />
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 relative z-10 border border-violet-500/20">
                <MapPin className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Visit Our Office</h3>
              <p className="text-white/50 text-sm mb-6 relative z-10">Headquarters, Zenbourg Technologies, New Delhi, India.</p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center text-violet-400 text-sm font-semibold hover:text-violet-300 transition-colors group/link relative z-10">
                Get Directions
                <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="w-full lg:w-2/3">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl h-full">
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="relative z-10 mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Send a Message</h2>
                <p className="text-white/50">Fill out the form below and we'll be in touch as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold tracking-widest text-white/40 uppercase">First Name</label>
                    <input 
                      {...register('firstName')}
                      type="text" 
                      className={`w-full bg-white/[0.03] border ${errors.firstName ? 'border-red-500/50' : 'border-white/[0.05]'} rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20 hover:bg-white/[0.05]`}
                      placeholder="John"
                      disabled={isSubmitting}
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold tracking-widest text-white/40 uppercase">Last Name</label>
                    <input 
                      {...register('lastName')}
                      type="text" 
                      className={`w-full bg-white/[0.03] border ${errors.lastName ? 'border-red-500/50' : 'border-white/[0.05]'} rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20 hover:bg-white/[0.05]`}
                      placeholder="Doe"
                      disabled={isSubmitting}
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold tracking-widest text-white/40 uppercase">Email Address</label>
                  <input 
                    {...register('email')}
                    type="email" 
                    className={`w-full bg-white/[0.03] border ${errors.email ? 'border-red-500/50' : 'border-white/[0.05]'} rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20 hover:bg-white/[0.05]`}
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold tracking-widest text-white/40 uppercase">Subject</label>
                  <select 
                    {...register('subject')}
                    className={`w-full bg-white/[0.03] border ${errors.subject ? 'border-red-500/50' : 'border-white/[0.05]'} rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.05] appearance-none [&>option]:bg-black`}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled className="text-white/20">Select a topic...</option>
                    <option value="support">General Support</option>
                    <option value="booking">Booking Issue</option>
                    <option value="partnership">Partnership / Host Registration</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold tracking-widest text-white/40 uppercase">Message</label>
                  <textarea 
                    {...register('message')}
                    rows={5}
                    className={`w-full bg-white/[0.03] border ${errors.message ? 'border-red-500/50' : 'border-white/[0.05]'} rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20 hover:bg-white/[0.05] resize-none`}
                    placeholder="How can we help you?"
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
