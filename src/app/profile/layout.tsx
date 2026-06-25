import Sidebar from '@/components/shared/Sidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 pt-16 md:pt-20">
      <div className="hidden md:block h-[calc(100vh-5rem)] sticky top-20">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
