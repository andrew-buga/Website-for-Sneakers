import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <span className="text-2xl font-display font-bold tracking-wider text-foreground">
              NIKE
            </span>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Bringing you the best in athletic footwear and innovation since 1964.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Help & Information
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href="/help/pagination" className="hover:text-foreground transition-colors">
                  Pagination
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="hover:text-foreground transition-colors">
                  Help center
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="hover:text-foreground transition-colors">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              About us
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href="/accessories" className="hover:text-foreground transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:text-foreground transition-colors">
                  Terms of use
                </Link>
              </li>
              <li>
                <Link href="/receivers-amplifiers" className="hover:text-foreground transition-colors">
                  Receivers & Amplifiers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="tel:+40740116669" className="hover:text-foreground transition-colors">+40 740 116 669</a></li>
              <li><a href="mailto:mykhailo.buha@student.usv.ro" className="hover:text-foreground transition-colors">mykhailo.buha@student.usv.ro</a></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact page</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Built for performance, comfort, and everyday style.
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Nike. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
