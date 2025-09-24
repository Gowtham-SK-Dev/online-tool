import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">DevTools</h3>
            <p className="text-sm text-muted-foreground">
              Free online developer tools to help you with your daily tasks.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/formatters/json" className="text-muted-foreground hover:text-foreground">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/tools/formatters/html" className="text-muted-foreground hover:text-foreground">
                  HTML Formatter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/text-utilities/case-converter"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Text Case Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/base64" className="text-muted-foreground hover:text-foreground">
                  Base64 Encoder/Decoder
                </Link>
              </li>
              <li>
                <Link href="/tools/design/color-converter" className="text-muted-foreground hover:text-foreground">
                  Color Picker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-muted-foreground hover:text-foreground">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {currentYear} Infosense Technologies. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">Built with ❤️ for developers worldwide</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
