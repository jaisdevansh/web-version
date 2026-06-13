import Sidebar from '@/components/shared/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 bg-black">
      <main className="flex-1 w-full mx-auto flex justify-center">
        {children}
      </main>
    </div>
  );
}
