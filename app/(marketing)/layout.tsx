import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 water-mesh -z-10" />
      <div className="fixed inset-0 water-caustics -z-10" />
      <Navigation />
      <main className="min-h-screen pt-16 relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
