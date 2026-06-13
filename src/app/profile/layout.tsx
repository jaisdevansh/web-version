import Sidebar from '@/components/shared/Sidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-1">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
