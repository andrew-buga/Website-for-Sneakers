export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <span className="text-2xl font-display font-bold tracking-wider text-foreground">
              NIKE
            </span>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Bringing you the best in athletic footwear and innovation since 1964.
            </p>
          </div>

          {/* Help & Information */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Help & Information
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Pagination
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms & Condition
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Address store
                </a>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              About us
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Accessories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Receivers & Amplifiers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>+40 740 116 669</li>
              <li>mykhailo.buha@student.usv.ro</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Thanks for watching. Crafted with care.
          </p>
          <p className="text-xs text-muted-foreground">
            {"© 2026 Nike. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
