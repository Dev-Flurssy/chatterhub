import { Shield, Heart, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Community Guidelines
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Building a safe, respectful, and welcoming community together
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              ChatterHub is a platform for meaningful connections and conversations. We believe in creating a space where everyone feels welcome, respected, and safe to express themselves. These guidelines help us maintain a positive community for all users.
            </p>
          </section>

          {/* Core Values */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Core Values
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🤝 Respect</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Treat everyone with kindness and consideration
                </p>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🛡️ Safety</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Keep our community safe and secure for all
                </p>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💬 Authenticity</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Be genuine and honest in your interactions
                </p>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🌟 Inclusivity</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome and celebrate diversity
                </p>
              </div>
            </div>
          </section>

          {/* What We Encourage */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                What We Encourage
              </h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Meaningful Conversations:</strong>
                  <span className="text-gray-700 dark:text-gray-300"> Share thoughtful content and engage in constructive discussions</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Support & Kindness:</strong>
                  <span className="text-gray-700 dark:text-gray-300"> Uplift others and offer help when you can</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Diverse Perspectives:</strong>
                  <span className="text-gray-700 dark:text-gray-300"> Share your unique viewpoint respectfully</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Creative Expression:</strong>
                  <span className="text-gray-700 dark:text-gray-300"> Share your art, ideas, and creativity</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Constructive Feedback:</strong>
                  <span className="text-gray-700 dark:text-gray-300"> Offer helpful suggestions in a respectful manner</span>
                </div>
              </li>
            </ul>
          </section>

          {/* What's Not Allowed */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                What's Not Allowed
              </h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Hate Speech & Discrimination
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Content that promotes hatred, violence, or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Harassment & Bullying
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Targeting individuals with abuse, threats, intimidation, or unwanted contact. This includes doxxing, stalking, and coordinated harassment.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Spam & Manipulation
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Repetitive posts, fake engagement, misleading links, or attempts to manipulate the platform for commercial gain without disclosure.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Explicit Content
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Pornography, graphic violence, or other adult content. ChatterHub is a general audience platform.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Illegal Activities
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Content promoting or facilitating illegal activities, including drug sales, weapons trafficking, or fraud.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Misinformation
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Deliberately spreading false information that could cause harm, especially regarding health, safety, or elections.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Impersonation
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Pretending to be someone else or creating fake accounts to deceive others.
                </p>
              </div>
            </div>
          </section>

          {/* Reporting */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reporting Violations
              </h2>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you see content or behavior that violates these guidelines:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Click the report button on the post or user profile</li>
                <li>Select the type of violation</li>
                <li>Provide additional context if needed</li>
                <li>Our moderation team will review within 24 hours</li>
              </ol>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                All reports are confidential. False reports may result in account restrictions.
              </p>
            </div>
          </section>

          {/* Consequences */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Enforcement & Consequences
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Violations of these guidelines may result in:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span><strong>Warning:</strong> First-time minor violations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span><strong>Content Removal:</strong> Posts that violate guidelines</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span><strong>Temporary Suspension:</strong> Repeated or serious violations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span><strong>Permanent Ban:</strong> Severe or repeated violations</span>
              </li>
            </ul>
          </section>

          {/* Appeals */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Appeals Process
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you believe your content was removed or your account was restricted in error, you can appeal the decision by contacting{' '}
              <a href="mailto:appeals@chatterhub.com" className="text-primary hover:underline">
                appeals@chatterhub.com
              </a>
              {' '}within 30 days. Include your username and a brief explanation.
            </p>
          </section>

          {/* Updates */}
          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              We may update these guidelines from time to time. Continued use of ChatterHub constitutes acceptance of the current guidelines.
            </p>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Questions about our guidelines?
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
