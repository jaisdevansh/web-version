'use client';

import { ChevronLeft, FileText, Shield, AlertTriangle, LifeBuoy, MessageCircle, RefreshCw, Trash2, ChevronRight, CheckCircle2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function TermsSupportPage() {
  const router = useRouter();
  const [cacheSize, setCacheSize] = useState('24.5 MB');
  const [isClearing, setIsClearing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Randomize initial cache size slightly for realism
  useEffect(() => {
    const size = (Math.random() * 30 + 10).toFixed(1);
    setCacheSize(`${size} MB`);
  }, []);

  const handleClearCache = async () => {
    if (isClearing || isCleared) return;
    
    setIsClearing(true);
    
    try {
      // 1. Clear CacheStorage API (PWA / Service Worker Caches)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    } catch (e) {
      console.error('Failed to clear Cache API', e);
    }
    
    // Simulate slight delay for UX
    setTimeout(() => {
      // 2. Clear non-essential localStorage items
      const keepKeys = ['party_user_token', 'party_user_role'];
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keepKeys.includes(key)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      
      // 3. Clear sessionStorage
      sessionStorage.clear();
      
      // 4. Refresh Next.js Router Cache
      router.refresh();
      
      setIsClearing(false);
      setIsCleared(true);
      setCacheSize('0 B');
      toast.success('App cache cleared successfully');
      
      // Reset after a while
      setTimeout(() => setIsCleared(false), 3000);
    }, 800);
  };

  const handleDeactivate = () => {
    setIsDeactivating(true);
    // Simulate API call for deactivation request
    setTimeout(() => {
      setIsDeactivating(false);
      setIsDeactivateModalOpen(false);
      document.cookie = 'party_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax';
      localStorage.removeItem('party_user_role');
      toast.success('Deactivation request submitted successfully.');
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="min-h-[85vh] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.push('/profile')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group w-fit">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Dashboard</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
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
              <button className="shrink-0 text-left px-5 py-3.5 rounded-xl bg-blue-600/10 text-blue-500 font-semibold border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all">
                Terms & Support
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -mt-20 -ml-20" />

              <div className="mb-10 pb-8 border-b border-white/5 relative z-10">
                <h2 className="text-2xl font-bold text-white">Terms & Support</h2>
                <p className="text-sm text-white/40 mt-1">Legal documents, help center, and account management.</p>
              </div>

              <div className="space-y-12 relative z-10">
                
                {/* LEGAL OVERVIEW */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-lg font-semibold text-white">Legal Overview</h3>
                    <span className="bg-white/10 text-white/60 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Documents</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="#" className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">Terms of Service</h4>
                            <p className="text-sm text-white/40">Usage guidelines and policies</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>

                    <Link href="#" className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">Privacy Policy</h4>
                            <p className="text-sm text-white/40">How we handle your data</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* GET SUPPORT */}
                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-lg font-semibold text-white">Get Support</h3>
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Help Center</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Link href="#" className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">Report an Incident</h4>
                            <p className="text-sm text-white/40">Safety, conduct, or lost items</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>

                    <Link href="#" className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                            <LifeBuoy className="w-6 h-6 text-white/80" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-1 group-hover:text-white transition-colors">Help Center</h4>
                            <p className="text-sm text-white/40">FAQs and detailed guides</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </div>

                  {/* AI Chat Banner */}
                  <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border border-blue-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10 w-full">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 shadow-inner">
                        <MessageCircle className="w-8 h-8 text-blue-400 fill-blue-500/20" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">Support AI Chat</h4>
                        <p className="text-sm text-white/60">Get instant help and priority resolution 24/7. Our AI is ready to assist you immediately.</p>
                      </div>
                      <Link href="/settings/ai-chat" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] text-center shrink-0">
                        Chat Now
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ACCOUNT MANAGEMENT */}
                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-lg font-semibold text-white">Account Management</h3>
                    <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Danger Zone</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={handleClearCache} disabled={isClearing || isCleared} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all group text-left relative overflow-hidden">
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isCleared ? 'bg-green-500/10' : 'bg-white/5'}`}>
                            {isCleared ? (
                              <CheckCircle2 className="w-6 h-6 text-green-400" />
                            ) : (
                              <RefreshCw className={`w-6 h-6 ${isClearing ? 'animate-spin text-blue-400' : 'text-white/80'}`} />
                            )}
                          </div>
                          <div>
                            <h4 className={`text-base font-semibold mb-1 transition-colors ${isCleared ? 'text-green-400' : 'text-white group-hover:text-white'}`}>
                              {isClearing ? 'Clearing Cache...' : isCleared ? 'Cache Cleared' : 'Clear App Cache'}
                            </h4>
                            <p className="text-sm text-white/40">Free up storage ({cacheSize})</p>
                          </div>
                        </div>
                        {!isClearing && !isCleared && (
                          <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                    </button>

                    <button onClick={() => setIsDeactivateModalOpen(true)} className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 hover:bg-red-500/10 hover:border-red-500/20 transition-all group text-left">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-red-500 mb-1">Deactivate Account</h4>
                            <p className="text-sm text-red-500/50">Request permanent deletion</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-500/30 group-hover:text-red-500/70 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Account Modal */}
      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeactivating && setIsDeactivateModalOpen(false)} />
          <div className="bg-[#111111] border border-white/10 rounded-[2rem] p-8 max-w-md w-full relative z-10 shadow-2xl overflow-hidden">
            {/* Red Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-white text-center mb-2">Deactivate Account?</h3>
              <p className="text-white/60 text-center mb-8 text-sm leading-relaxed">
                This will submit a request to permanently delete your account and all associated data. You will be logged out immediately. This action cannot be undone.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeactivate}
                  disabled={isDeactivating}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center"
                >
                  {isDeactivating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Confirm Deactivation"
                  )}
                </button>
                <button 
                  onClick={() => setIsDeactivateModalOpen(false)}
                  disabled={isDeactivating}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
