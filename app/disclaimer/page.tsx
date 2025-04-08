import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disclaimer - DevTools",
  description: "Disclaimer for DevTools online developer utilities.",
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

      <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Interpretation and Definitions</h2>
        <p>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The
          following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The information provided by DevTools ("we," "us," or "our") on our website is for general informational
          purposes only. All information on the website is provided in good faith, however we make no representation or
          warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability,
          availability, or completeness of any information on the website.
        </p>

        <p>
          Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a
          result of the use of the website or reliance on any information provided on the website. Your use of the
          website and your reliance on any information on the website is solely at your own risk.
        </p>

        <h2>External Links Disclaimer</h2>
        <p>
          The website may contain (or you may be sent through the website) links to other websites or content belonging
          to or originating from third parties or links to websites and features in banners or other advertising. Such
          external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability,
          availability, or completeness by us.
        </p>

        <p>
          We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any
          information offered by third-party websites linked through the website or any website or feature linked in any
          banner or other advertising. We will not be a party to or in any way be responsible for monitoring any
          transaction between you and third-party providers of products or services.
        </p>

        <h2>Professional Disclaimer</h2>
        <p>
          The website cannot and does not contain legal, financial, or professional advice. The legal, financial, and
          professional information is provided for general informational and educational purposes only and is not a
          substitute for professional advice.
        </p>

        <p>
          Accordingly, before taking any actions based upon such information, we encourage you to consult with the
          appropriate professionals. We do not provide any kind of legal, financial, or professional advice. The use or
          reliance of any information contained on the website is solely at your own risk.
        </p>

        <h2>Errors and Omissions Disclaimer</h2>
        <p>
          The information given by the website is for general guidance on matters of interest only. Even if we take
          every precaution to ensure that the content of the website is both current and accurate, errors can occur.
          Plus, given the changing nature of laws, rules, and regulations, there may be delays, omissions, or
          inaccuracies in the information contained on the website.
        </p>

        <p>
          We are not responsible for any errors or omissions, or for the results obtained from the use of this
          information.
        </p>

        <h2>Fair Use Disclaimer</h2>
        <p>
          The website may contain copyrighted material the use of which has not always been specifically authorized by
          the copyright owner. We are making such material available in our efforts to advance understanding of
          environmental, political, human rights, economic, democracy, scientific, and social justice issues, etc.
        </p>

        <p>
          We believe this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of
          the US Copyright Law.
        </p>

        <h2>Views Expressed Disclaimer</h2>
        <p>
          The website may contain views and opinions which are those of the authors and do not necessarily reflect the
          official policy or position of any other author, agency, organization, employer, or company, including us.
        </p>

        <p>
          Comments published by users are their sole responsibility and the users will take full responsibility,
          liability, and blame for any libel or litigation that results from something written in or as a direct result
          of something written in a comment. We are not liable for any comment published by users and reserve the right
          to delete any comment for any reason whatsoever.
        </p>

        <h2>No Responsibility Disclaimer</h2>
        <p>
          The information on the website is provided with the understanding that we are not herein engaged in rendering
          legal, accounting, tax, or other professional advice and services. As such, it should not be used as a
          substitute for consultation with professional accounting, tax, legal, or other competent advisers.
        </p>

        <p>
          In no event shall we or our suppliers be liable for any special, incidental, indirect, or consequential
          damages whatsoever arising out of or in connection with your access or use or inability to access or use the
          website.
        </p>

        <h2>"Use at Your Own Risk" Disclaimer</h2>
        <p>
          All information in the website is provided "as is," with no guarantee of completeness, accuracy, timeliness,
          or of the results obtained from the use of this information, and without warranty of any kind, express or
          implied, including, but not limited to warranties of performance, merchantability, and fitness for a
          particular purpose.
        </p>

        <p>
          We will not be liable to you or anyone else for any decision made or action taken in reliance on the
          information given by the website or for any consequential, special, or similar damages, even if advised of the
          possibility of such damages.
        </p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Disclaimer, please contact us at:</p>
        <p>Email: disclaimer@devtools-example.com</p>
      </div>
    </div>
  )
}
