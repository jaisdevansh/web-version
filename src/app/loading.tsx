import { Skeleton } from '@/components/ui/skeleton';

export default function GlobalLoading() {
  return (
    <div className="min-h-[85vh] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 font-sans bg-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-[250px] bg-white/5" />
            <Skeleton className="h-5 w-[350px] bg-white/5" />
          </div>
          <Skeleton className="h-12 w-[150px] rounded-xl bg-white/5" />
        </div>

        {/* Content Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/[0.08] rounded-[2rem] p-6 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl bg-white/5" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4 bg-white/5" />
                <Skeleton className="h-4 w-1/2 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
