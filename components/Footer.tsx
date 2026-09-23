import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 glass-morphism mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-xl">C</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gradient">ChiefOS</span>
            </div>
            <p className="text-foreground/60 max-w-md text-sm sm:text-base">
              ChiefOS co-ordinates specialised agents under clear roles and approvals. You set the brief; they execute within the guardrails you define.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-foreground/60 text-sm">
              <li><Link href="/services" className="hover:text-accent-teal transition-colors">Services</Link></li>
              <li><Link href="/how-we-work" className="hover:text-accent-teal transition-colors">Process</Link></li>
              <li><Link href="/work" className="hover:text-accent-teal transition-colors">Work</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-foreground/60 text-sm">
              <li><Link href="/contact" className="hover:text-accent-teal transition-colors">Contact</Link></li>
              <li><Link href="/api/auth/signin" className="hover:text-accent-teal transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-foreground/40 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} ChiefOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
