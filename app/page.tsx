import Link from "next/link";
import { useRouter } from "next/navigation";

const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "#", hasDropdown: true },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function HomePage() {
  const { pathname } = useRouter();

  return (
    <div>
      <h1>Welcome to DevTools</h1>
      <p>Explore our tools and utilities for developers.</p>
      <nav>
        {mainNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === item.href || (item.href === "/" && pathname === "/") ? "text-foreground" : "text-foreground/60"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}