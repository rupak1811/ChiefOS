import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AppSidebar from "@/components/AppSidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="fixed inset-0 water-mesh -z-10" />
      <div className="fixed inset-0 water-caustics -z-10" />
      <AppSidebar user={session.user} />
      <main className="flex-1 p-8 overflow-auto relative">
        {children}
      </main>
    </div>
  );
}
