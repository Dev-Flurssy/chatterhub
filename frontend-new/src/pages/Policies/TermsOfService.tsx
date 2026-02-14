import { FileText } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8 text-gray-700 dark:text-gray-300">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Agreement to Terms
            </h2>
            <p className="mb-3">
              By accessing or using ChatterHub ("Service", "Platform", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Eligibility
            </h2>
            <p className="mb-3">
              You must be at least 13 years old to use ChatterHub. By using the Service, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You are at least 13 years of age</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You will comply with these Terms and all applicable laws</li>
              <li>You have not been previously suspended or removed from the Service</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Account Registration
            </h2>
            <p className="mb-3">
              To access certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p className="mt-3">
              You may not use another person's account without permission or create multiple accounts for abusive purposes.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. User Content
            </h2>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              4.1 Your Content
            </h3>
            <p className="mb-3">
              You retain ownership of content you post ("User Content"). By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content in connection with operating the Service.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              4.2 Content Restrictions
            </h3>
            <p className="mb-3">
              You agree not to post content that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violates any law or regulation</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains hate speech, harassment, or discrimination</li>
              <li>Is sexually explicit or violent</li>
              <li>Promotes illegal activities</li>
              <li>Contains malware or harmful code</li>
              <li>Impersonates others or misrepresents your affiliation</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">
              4.3 Content Moderation
            </h3>
            <p>
              We reserve the right to remove any content that violates these Terms or our Community Guidelines, without prior notice.
            </p>
          </section>

          {/* Prohibited Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Prohibited Conduct
            </h2>
            <p className="mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Service for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Spam or send unsolicited messages</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated systems (bots) without permission</li>
              <li>Collect user data without consent</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Intellectual Property
            </h2>
            <p className="mb-3">
              The Service and its original content (excluding User Content), features, and functionality are owned by ChatterHub and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              Our trademarks and trade dress may not be used without our prior written permission.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Third-Party Services
            </h2>
            <p className="mb-3">
              The Service may contain links to third-party websites or services (e.g., Google Sign-In, Apple Sign-In) that are not owned or controlled by ChatterHub.
            </p>
            <p>
              We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party services. You acknowledge and agree that we shall not be liable for any damage or loss caused by your use of such services.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Termination
            </h2>
            <p className="mb-3">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation of these Terms</li>
              <li>Violation of Community Guidelines</li>
              <li>Fraudulent or illegal activity</li>
              <li>At our sole discretion</li>
            </ul>
            <p className="mt-3">
              Upon termination, your right to use the Service will immediately cease. You may delete your account at any time by contacting support.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Disclaimers
            </h2>
            <p className="mb-3">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the Service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or reliability of content</li>
            </ul>
            <p className="mt-3">
              We do not warrant that the Service will meet your requirements or that defects will be corrected.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Limitation of Liability
            </h2>
            <p className="mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHATTERHUB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p>
              Our total liability shall not exceed the amount you paid us in the past twelve months, or $100, whichever is greater.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless ChatterHub and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another</li>
              <li>Your User Content</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              12. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              13. Changes to Terms
            </h2>
            <p className="mb-3">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Posting the new Terms on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending an email notification (for significant changes)</li>
            </ul>
            <p className="mt-3">
              Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              14. Contact Us
            </h2>
            <p className="mb-3">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="mb-1">
                <strong>Email:</strong> legal@chatterhub.com
              </p>
              <p className="mb-1">
                <strong>Support:</strong> support@chatterhub.com
              </p>
              <p>
                <strong>Website:</strong> <a href="/contact" className="text-primary hover:underline">Contact Form</a>
              </p>
            </div>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              15. Severability
            </h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              16. Entire Agreement
            </h2>
            <p>
              These Terms, together with our Privacy Policy and Community Guidelines, constitute the entire agreement between you and ChatterHub regarding the Service and supersede all prior agreements.
            </p>
          </section>
        </div>

        {/* Acknowledgment */}
        <div className="mt-8 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            By using ChatterHub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
