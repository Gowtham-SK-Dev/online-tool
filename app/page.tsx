const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "#", hasDropdown: true },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to DevTools</h1>
      <p>Explore our tools and utilities for developers.</p>
    </div>
  );
}