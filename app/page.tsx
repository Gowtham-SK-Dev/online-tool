"use client";

import Link from "next/link";

const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "#", hasDropdown: true },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to DevTools</h1>
          <p className="text-lg mb-6">
            Simplify your development workflow with our free online tools.
          </p>
          <Link
            href="/tools"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Explore Tools
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Why Choose DevTools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4">Fast and Reliable</h3>
              <p>Get instant results with tools optimized for speed and accuracy.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4">Wide Range of Tools</h3>
              <p>Access formatters, converters, and validators all in one place.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4">Completely Free</h3>
              <p>All tools are free to use with no hidden costs or subscriptions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Popular Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/tools/formatters/json"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-4">JSON Formatter</h3>
              <p>Format and beautify your JSON data for better readability.</p>
            </Link>
            <Link
              href="/tools/converters/csv-to-json"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-4">CSV to JSON Converter</h3>
              <p>Convert CSV files to JSON format quickly and easily.</p>
            </Link>
            <Link
              href="/tools/backend/api-tester"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-4">API Tester</h3>
              <p>Test your APIs with custom headers, parameters, and body data.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} DevTools. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}