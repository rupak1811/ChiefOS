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
    <div className="h-screen overflow-hidden relative">
      <div className="fixed inset-0 water-mesh -z-10" />
      <div className="fixed inset-0 water-caustics -z-10" />
      <AppSidebar user={session.user} />
<<<<<<< HEAD
      <main className="lg:pl-64 h-screen overflow-hidden">
        <div className="h-full w-full p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
=======
      <main className="lg:pl-64 h-screen overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 overflow-auto">
>>>>>>> 43a3ba9 (feat: Complete responsive implementation with mobile drawer sidebar)
          {children}
        </div>
      </main>
    </div>
  );
}
