import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us - DevTools",
  description:
    "Learn about DevTools, our mission, and the team behind our free online developer utilities.",
  keywords:
    "developer tools, online utilities, web development tools, about us, dev tools mission",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About DevTools</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground">
            DevTools is a collection of free online utilities crafted to make
            developers' lives easier.
          </p>

          <h2>Our Mission</h2>
          <p>
            We aim to provide high-quality, accessible tools that streamline
            developer workflows and solve common problems — all for free. We
            believe great tools should be available to everyone, regardless of
            skill level or budget.
          </p>

          <h2>What We Offer</h2>
          <p>Our toolkit includes utilities like:</p>
          <ul>
            <li>Text and data manipulation tools</li>
            <li>Encoding and decoding utilities</li>
            <li>Formatters and converters</li>
            <li>Productivity boosters for everyday tasks</li>
          </ul>

          <p>All our tools are:</p>
          <ul>
            <li>
              <strong>Free to use</strong> — No sign-up or subscription
              required
            </li>
            <li>
              <strong>Privacy-first</strong> — Your data stays in your browser
            </li>
            <li>
              <strong>Fast and lightweight</strong> — Optimized for performance
            </li>
            <li>
              <strong>Accessible</strong> — Built with everyone in mind
            </li>
            <li>
              <strong>Open source</strong> — Built transparently with community
              feedback
            </li>
          </ul>

          <h2>Our Story</h2>
          <p>
            DevTools began as a side project by developers frustrated with
            juggling multiple websites to get things done. We wanted a single
            hub with a consistent, clean UI for all essential tools.
          </p>

          <p>
            Today, DevTools is used by thousands of developers around the world.
            We're constantly refining tools and adding new ones based on real
            feedback from people like you.
          </p>

          <h2>Our Values</h2>
          <ul>
            <li>
              <strong>Simplicity</strong> — Tools should be intuitive and
              user-friendly
            </li>
            <li>
              <strong>Quality</strong> — Every tool must work flawlessly
            </li>
            <li>
              <strong>Transparency</strong> — What you see is what you get
            </li>
            <li>
              <strong>Community</strong> — We listen, build, and improve with
              your help
            </li>
            <li>
              <strong>Accessibility</strong> — Tools should be usable by
              everyone, everywhere
            </li>
          </ul>

          <h2>The Team</h2>
          <p>
            We are a small team of developers, designers, and product
            enthusiasts who love solving problems with clean code and great
            design. Our diverse backgrounds help us build better tools for the
            global developer community.
          </p>

          <h2>Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have a suggestion, want a
            new tool added, or just want to say hi — reach out.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/contact">
              <Button>Contact Us</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Explore Our Tools</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
