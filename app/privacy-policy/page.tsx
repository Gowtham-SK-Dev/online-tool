import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - DevTools",
  description: "Privacy policy for DevTools online developer utilities.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Introduction</h2>
        <p>
          Welcome to DevTools ("we," "our," or "us"). We respect your privacy and are committed to protecting your
          personal data. This privacy policy will inform you about how we look after your personal data when you visit
          our website and tell you about your privacy rights.
        </p>

        <h2>Information We Collect</h2>
        <p>When you use our website, we may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Usage Data:</strong> Information about how you use our website, including which tools you use and
            how you interact with them.
          </li>
          <li>
            <strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone
            setting, browser plug-in types and versions, operating system and platform, and other technology on the
            devices you use to access this website.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>To provide and maintain our service</li>
          <li>To improve our website and user experience</li>
          <li>To monitor the usage of our website</li>
          <li>To detect, prevent, and address technical issues</li>
          <li>To serve relevant advertisements</li>
        </ul>

        <h2>Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our website and hold certain
          information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
        </p>
        <p>We use the following types of cookies:</p>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Necessary for the website to function properly.
          </li>
          <li>
            <strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and
            see how visitors move around our website.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> Used to recognize you when you return to our website.
          </li>
          <li>
            <strong>Targeting Cookies:</strong> Record your visit to our website, the pages you have visited, and the
            links you have followed. We may use this information to make our website and the advertising displayed on it
            more relevant to your interests.
          </li>
        </ul>

        <h2>Google AdSense</h2>
        <p>
          We use Google AdSense to serve advertisements on our website. Google AdSense may use cookies and web beacons
          to collect information about your visits to this and other websites to provide you with relevant
          advertisements.
        </p>
        <p>
          Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site
          and/or other sites on the Internet. You may opt out of personalized advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </p>

        <h2>Data Security</h2>
        <p>
          We have implemented appropriate security measures to prevent your personal data from being accidentally lost,
          used, or accessed in an unauthorized way, altered, or disclosed.
        </p>
        <p>
          All data processing in our tools happens in your browser. Your code and text are not sent to our servers
          unless explicitly stated.
        </p>

        <h2>Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
        <ul>
          <li>The right to access, update, or delete your personal information</li>
          <li>The right to rectification</li>
          <li>The right to object to processing</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>Email: privacy@devtools-example.com</p>
      </div>
    </div>
  )
}
