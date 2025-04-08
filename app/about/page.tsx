import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us - DevTools",
  description: "Learn about DevTools, our mission, and the team behind our free online developer utilities.",
  keywords: "developer tools, online utilities, web development tools, about us, dev tools mission",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About DevTools</h1>

        <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
          <p className="lead text-xl text-muted-foreground">
            DevTools is a collection of free online utilities designed to make developers' lives easier.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to provide high-quality, free, and accessible developer tools that help streamline workflows
            and solve common problems. We believe that great tools should be available to everyone, regardless of their
            experience level or financial resources.
          </p>

          <h2>What We Offer</h2>
          <p>We offer a wide range of tools for developers, including:</p>
          <ul>
            <li>Code formatters and beautifiers</li>
            <li>Text manipulation utilities</li>
            <li>Encoding/decoding tools</li>
            <li>Color pickers and converters</li>
            <li>QR code generators</li>
            <li>And much more!</li>
          </ul>

          <p>All of our tools are:</p>
          <ul>
            <li>
              <strong>Free to use</strong> - No registration or payment required
            </li>
            <li>
              <strong>Privacy-focused</strong> - Your data never leaves your browser
            </li>
            <li>
              <strong>Fast and reliable</strong> - Optimized for performance
            </li>
            <li>
              <strong>Accessible</strong> - Designed to work for everyone
            </li>
            <li>
              <strong>Open source</strong> - Transparent and community-driven
            </li>
          </ul>

          <h2>Our Story</h2>
          <p>
            DevTools was created by a team of passionate developers who were tired of jumping between different websites
            to use various development utilities. We wanted to create a single platform that would house all the tools
            we use on a daily basis, with a consistent, user-friendly interface.
          </p>

          <p>
            What started as a small side project has grown into a comprehensive suite of tools used by thousands of
            developers worldwide. We're constantly adding new tools and improving existing ones based on user feedback.
          </p>

          <h2>Our Values</h2>
          <p>At DevTools, we believe in:</p>
          <ul>
            <li>
              <strong>Simplicity</strong> - Tools should be intuitive and easy to use
            </li>
            <li>
              <strong>Quality</strong> - Every tool should work flawlessly
            </li>
            <li>
              <strong>Privacy</strong> - Your data belongs to you
            </li>
            <li>
              <strong>Community</strong> - We grow and improve through user feedback
            </li>
            <li>
              <strong>Accessibility</strong> - Our tools should work for everyone
            </li>
          </ul>

          <h2>The Team</h2>
          <p>
            Our team consists of experienced developers, designers, and product managers who are passionate about
            creating useful tools for the developer community. We come from diverse backgrounds and have experience
            working with various technologies and frameworks.
          </p>

          <p>
            We're constantly looking for ways to improve our tools and add new ones based on the needs of the developer
            community. If you have suggestions or feedback, we'd love to hear from you!
          </p>

          <h2>Get in Touch</h2>
          <p>
            We love hearing from our users! Whether you have feedback, suggestions for new tools, or just want to say
            hello, we'd love to hear from you.
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
  )
}
