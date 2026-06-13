import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center bg-[#050505]">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <p className="text-white/50 text-sm font-medium animate-pulse">Loading dashboard...</p>
    </div>
  );
}
