import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - DevTools",
  description: "Terms of service for DevTools online developer utilities.",
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Introduction</h2>
        <p>
          Welcome to DevTools. These Terms of Service govern your use of our website and the tools we provide. By
          accessing or using our website, you agree to be bound by these Terms.
        </p>

        <h2>Use of Our Services</h2>
        <p>
          You may use our services only as permitted by these terms and any applicable laws. Don't misuse our services.
          For example, don't interfere with our services or try to access them using a method other than the interface
          and the instructions that we provide.
        </p>

        <h2>Your Content</h2>
        <p>
          Our services allow you to input, upload, or store content such as code, text, and other materials. You retain
          ownership of any intellectual property rights that you hold in that content.
        </p>
        <p>
          When you upload, submit, store, send, or receive content to or through our services, you give us a worldwide
          license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly
          perform, publicly display, and distribute such content.
        </p>

        <h2>Privacy</h2>
        <p>
          Our Privacy Policy explains how we treat your personal data and protect your privacy when you use our
          services. By using our services, you agree that we can use such data in accordance with our privacy policy.
        </p>

        <h2>Advertisements</h2>
        <p>
          Our services are supported by advertising revenue. In consideration for your access to and use of the
          services, you agree that we may place advertisements on the services.
        </p>
        <p>
          Some of the services are supported by advertising revenue and may display advertisements and promotions. These
          advertisements may be targeted based on the content of information on the services, queries made through the
          services, or other information.
        </p>

        <h2>Advertisements and Third-Party Content</h2>
        <p>
          This website displays advertisements served by Google AdSense and other third-party advertising networks.
          These advertisements may collect and use information about your visits to this and other websites to provide
          advertisements about goods and services of interest to you.
        </p>
        <p>
          If you would like more information about this practice and to know your choices about not having this
          information used by these companies, please visit{" "}
          <a
            href="https://www.google.com/policies/technologies/ads/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google's Advertising Policies
          </a>
          .
        </p>
        <p>
          We do not control the content of these advertisements and are not responsible for the claims made in them. We
          do not endorse the products or services offered in these advertisements.
        </p>
        <p>
          We reserve the right to remove or disable advertisements that we consider inappropriate or that violate our
          policies.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          We provide our services "as is," and without any warranty or condition, express, implied, or statutory. We
          specifically disclaim any implied warranties of title, merchantability, fitness for a particular purpose, and
          non-infringement. We make no warranty that:
        </p>
        <ul>
          <li>Our services will meet your requirements</li>
          <li>Our services will be available on an uninterrupted, timely, secure, or error-free basis</li>
          <li>The results that may be obtained from the use of our services will be accurate or reliable</li>
          <li>
            The quality of any products, services, information, or other material purchased or obtained by you through
            our services will meet your expectations
          </li>
        </ul>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
          indirectly, or any loss of data, use, goodwill, or other intangible losses.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may revise these terms from time to time. If we make a material change to these terms, we will provide you
          with reasonable notice prior to the changes taking effect.
        </p>

        <h2>Contact Us</h2>
        <p>If you have any questions about these Terms of Service, please contact us at:</p>
        <p>Email: onlinetools@infosensetechnologies.com</p>
      </div>
    </div>
  )
}
