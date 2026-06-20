'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SupportPage() {
  const { user, profile } = useAuthStore();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill out all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/v1/support/contact', { subject, message });
      if (response.data?.success || response.status === 200 || response.status === 201) {
        toast.success('Complaint submitted successfully. Our team will review it shortly.');
        setSubject('');
        setMessage('');
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase text-white mb-2">Help & Support</h1>
        <p className="text-gray-400">Submit a complaint or request assistance regarding your bookings or account.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">You are submitting this ticket as <span className="font-bold text-white">{profile?.name || user?.name}</span> ({profile?.email || user?.email})</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Subject / Complaint Type</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              required
            >
              <option value="" disabled>Select an option...</option>
              <option value="booking_issue">Booking / Ticket Issue</option>
              <option value="payment_issue">Payment / Refund</option>
              <option value="account_issue">Account Problem</option>
              <option value="venue_complaint">Venue Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Message Details</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[150px] resize-y"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 py-6 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                SUBMITTING...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                SUBMIT TICKET
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Need instant help?</h3>
          <p className="text-sm text-gray-400">Try talking to our Elite AI Support Chatbot.</p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 sm:mt-0 border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white"
          onClick={() => window.location.href = '/contact'}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          AI Chat
        </Button>
      </div>
    </div>
  );
}
