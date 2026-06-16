'use client';

import { ChevronLeft, Trash2, ArrowUp, Sparkles, MessageCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import api from '@/lib/axios';

export default function AIChatPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

  return (
    <div className="min-h-[85vh] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <button onClick={() => router.push('/settings/terms')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group w-fit">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Terms & Support</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 flex-1">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4 shrink-0 space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
              <p className="text-white/50 mt-2 text-sm leading-relaxed">
                Manage your account settings, personal details, and preferences to customize your experience.
              </p>
            </div>

            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
              <button onClick={() => router.push('/settings/edit-profile')} className="shrink-0 text-left px-5 py-3.5 rounded-xl hover:bg-white/5 text-white/60 font-medium transition-colors">
                Personal Info
              </button>
              <button onClick={() => router.push('/settings/notifications')} className="shrink-0 text-left px-5 py-3.5 rounded-xl hover:bg-white/5 text-white/60 font-medium transition-colors">
                Notifications
              </button>
              <button onClick={() => router.push('/settings/terms')} className="shrink-0 text-left px-5 py-3.5 rounded-xl hover:bg-white/5 text-white/60 font-medium transition-colors">
                Terms & Support
              </button>
              <button className="shrink-0 text-left px-5 py-3.5 rounded-xl bg-blue-600/10 text-blue-500 font-semibold border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all">
                AI Chat
              </button>
            </nav>
          </div>

          {/* Main Chat Area */}
          <div className="w-full lg:w-3/4 flex flex-col min-h-[600px]">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col flex-1">
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0A0A0A] rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Elite Support Online</h2>
                    <p className="text-sm text-white/40">Powered by AI • 24/7</p>
                  </div>
                </div>
                <button onClick={clearChat} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors" title="Clear Chat">
                  <Trash2 className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-6 hide-scrollbar relative z-10 flex flex-col">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center pb-8 mt-10">
                    <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                      <MessageCircle className="w-10 h-10 text-blue-500 fill-blue-500/20" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">How can I help you?</h2>
                    <p className="text-white/40 text-sm max-w-sm text-center leading-relaxed">
                      I'm your Elite AI Support. Ask me anything about your account, bookings, or platform features.
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#222222] border border-white/10' : 'bg-blue-500/20 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]'}`}>
                          {msg.role === 'user' ? <User className="w-5 h-5 text-white/70" /> : <Sparkles className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' : 'bg-blue-600/10 text-blue-50 border border-blue-500/20 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-4 flex-row">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
                          <Sparkles className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 w-fit">
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
              <div className="relative z-10 mt-auto">
                <div className="relative bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all flex items-center pr-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-transparent px-6 py-5 text-white focus:outline-none placeholder:text-white/30 text-base"
                    placeholder="Ask me anything..."
                  />
                  <button onClick={handleSend} disabled={!input.trim() || isTyping} className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all shadow-lg hover:scale-105 shrink-0">
                    <ArrowUp className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-center text-[11px] text-white/30 mt-4 font-medium tracking-wide">
                  AI Chat may produce inaccurate information about people, places, or facts.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
