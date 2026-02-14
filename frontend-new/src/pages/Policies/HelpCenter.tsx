import { useState } from 'react';
import { Search, MessageCircle, Shield, Users, Settings, Mail, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the top right corner, fill in your details (name, email, password), and optionally add a username and phone number. You can also sign up using Google or Apple.',
  },
  {
    category: 'Getting Started',
    question: 'Do I need to verify my email?',
    answer: 'Yes, email verification is required to access all features. After signing up, you\'ll receive a verification code via email. In dev mode, the code is displayed on screen.',
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the sign-in page, enter your email, and we\'ll send you a reset link. The link is valid for 1 hour.',
  },
  {
    category: 'Account',
    question: 'Can I change my username?',
    answer: 'Yes! Go to your profile, click "Edit Profile", and update your username. Usernames must be unique and between 3-30 characters.',
  },
  {
    category: 'Account',
    question: 'How do I delete my account?',
    answer: 'Contact our support team at support@chatterhub.com to request account deletion. We\'ll process your request within 48 hours.',
  },
  {
    category: 'Posts & Content',
    question: 'How do I create a post?',
    answer: 'Navigate to the Feed page and click the "Create Post" button. You can add text, images, and share your thoughts with the community.',
  },
  {
    category: 'Posts & Content',
    question: 'Can I edit or delete my posts?',
    answer: 'Yes! Click the three dots menu on your post and select "Edit" or "Delete". Edited posts will show an "edited" indicator.',
  },
  {
    category: 'Posts & Content',
    question: 'What content is not allowed?',
    answer: 'Please review our Community Guidelines. We don\'t allow hate speech, harassment, spam, illegal content, or explicit material.',
  },
  {
    category: 'Privacy & Security',
    question: 'Who can see my posts?',
    answer: 'Currently, all posts are public and visible to all users. We\'re working on privacy controls for future updates.',
  },
  {
    category: 'Privacy & Security',
    question: 'How is my data protected?',
    answer: 'We use industry-standard encryption, secure authentication, and never sell your personal information. Read our Privacy Policy for details.',
  },
  {
    category: 'Privacy & Security',
    question: 'Can I block or report users?',
    answer: 'Yes! Click on a user\'s profile and select "Report User". Admins will review reports within 24 hours.',
  },
  {
    category: 'Features',
    question: 'How do notifications work?',
    answer: 'You\'ll receive real-time notifications for likes, comments, follows, and mentions. Click the bell icon in the header to view them.',
  },
  {
    category: 'Features',
    question: 'What is the Discover page?',
    answer: 'The Discover page (Find People) helps you find and connect with other users. You can follow users to see their posts in your feed.',
  },
  {
    category: 'Technical',
    question: 'Which browsers are supported?',
    answer: 'ChatterHub works best on Chrome, Firefox, Safari, and Edge (latest versions). Mobile browsers are also supported.',
  },
  {
    category: 'Technical',
    question: 'Why am I not receiving emails?',
    answer: 'Check your spam folder. If in dev mode, emails are logged to console instead of sent. For production issues, contact support.',
  },
];

const categories = ['All', 'Getting Started', 'Account', 'Posts & Content', 'Privacy & Security', 'Features', 'Technical'];

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <a
            href="#getting-started"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all group"
          >
            <MessageCircle className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Getting Started</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learn the basics</p>
          </a>

          <a
            href="#account"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all group"
          >
            <Settings className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Account Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account</p>
          </a>

          <a
            href="#privacy"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all group"
          >
            <Shield className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Privacy & Safety</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Stay secure</p>
          </a>

          <a
            href="#community"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all group"
          >
            <Users className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Community</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Connect with others</p>
          </a>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>

          {filteredFAQs.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No results found. Try a different search term.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start space-x-3 text-left">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded mt-1">
                        {faq.category}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                    </div>
                    {expandedIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedIndex === index && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="mb-6 text-white/90">
            Our support team is here to assist you
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
