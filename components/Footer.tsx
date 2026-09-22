import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 glass-morphism mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-gradient">ChiefOS</span>
            </div>
            <p className="text-foreground/60 max-w-md">
              ChiefOS co-ordinates specialised agents under clear roles and approvals. You set the brief; they execute within the guardrails you define.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-foreground/60">
              <li><Link href="/services" className="hover:text-accent-teal transition-colors">Services</Link></li>
              <li><Link href="/how-we-work" className="hover:text-accent-teal transition-colors">Process</Link></li>
              <li><Link href="/work" className="hover:text-accent-teal transition-colors">Work</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-foreground/60">
              <li><Link href="/contact" className="hover:text-accent-teal transition-colors">Contact</Link></li>
              <li><Link href="/api/auth/signin" className="hover:text-accent-teal transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-foreground/40 text-sm">
          <p>&copy; {new Date().getFullYear()} ChiefOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
