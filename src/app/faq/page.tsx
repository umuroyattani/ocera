import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is Ocera and how does it work?",
          answer:
            "Ocera is an AI-powered Reddit posting tool that helps you create and distribute content across multiple Reddit communities efficiently. You write your content once, and our AI optimizes it for different subreddits based on their rules, culture, and audience preferences. Our platform analyzes each community's posting patterns and automatically adapts your content's tone, format, and style for maximum engagement.",
        },
        {
          question: "Do I need a Reddit account to use Ocera?",
          answer:
            "Yes, you'll need to connect your Reddit account through our secure OAuth integration. This allows Ocera to post on your behalf while keeping your credentials safe. We never store your Reddit password and use industry-standard OAuth2 authentication to ensure your account security.",
        },
        {
          question: "How do I get started with Ocera?",
          answer:
            "Getting started is simple: 1) Sign up for a free Ocera account, 2) Connect your Reddit account through our secure OAuth integration, 3) Use our AI Content Optimizer to create your first post, 4) Let our AI suggest the best subreddits for your content, and 5) Schedule your posts with smart timing. Our dashboard guides you through each step.",
        },
        {
          question: "Is Ocera free to use?",
          answer:
            "Yes! We offer a generous free plan that includes 5 posts per month, access to 3 subreddits, basic AI optimization, and community support. This is perfect for trying out Ocera and seeing how it works for your content. You can upgrade to paid plans for more features and higher limits.",
        },
      ],
    },
    {
      category: "AI Features",
      questions: [
        {
          question: "How does the AI optimization work?",
          answer:
            "Our AI analyzes each subreddit's rules, posting patterns, successful content, and community culture using advanced machine learning models. It then adapts your content's tone, format, and style to maximize engagement while ensuring compliance with subreddit guidelines. The AI considers factors like community size, engagement patterns, preferred content types, and posting etiquette.",
        },
        {
          question: "Can the AI suggest which subreddits to post in?",
          answer:
            "Absolutely! Our AI Subreddit Suggestions feature analyzes your content and recommends the most relevant communities based on topic relevance, audience match, engagement potential, and rule compatibility. It provides detailed information about each suggested subreddit including subscriber count, engagement levels, and why it's a good fit for your content.",
        },
        {
          question:
            "What if the AI-optimized content doesn't match my brand voice?",
          answer:
            "You have full control over the final content. The AI provides suggestions that you can edit, modify, or completely rewrite. You can also set tone preferences (professional, casual, friendly, technical, enthusiastic) and brand guidelines for more consistent results. The AI learns from your edits to provide better suggestions over time.",
        },
        {
          question: "How accurate are the AI suggestions?",
          answer:
            "Our AI is trained on millions of successful Reddit posts and continuously learns from community feedback. While we can't guarantee success (Reddit engagement depends on many factors), our users typically see 40-60% better engagement rates compared to non-optimized posts. The AI is particularly effective at avoiding common posting mistakes that lead to removals.",
        },
      ],
    },
    {
      category: "Reddit Compliance & Safety",
      questions: [
        {
          question: "Is Ocera compliant with Reddit's terms of service?",
          answer:
            "Yes, Ocera is fully compliant with Reddit's terms of service and API guidelines. We use Reddit's official API, respect all rate limits, and follow posting guidelines. Our platform includes built-in safeguards to prevent spam, maintain healthy posting patterns, and ensure compliance with both Reddit's global rules and individual subreddit guidelines.",
        },
        {
          question: "How does Ocera prevent my account from being banned?",
          answer:
            "We implement multiple safety measures: smart delays between posts (respecting Reddit's rate limits), automatic analysis of subreddit rules before posting, posting frequency limits that mimic natural human behavior, warnings about potential rule violations, and monitoring for shadowbans or restrictions. Our system is designed to maintain healthy posting patterns that Reddit moderators appreciate.",
        },
        {
          question: "What happens if my post violates a subreddit rule?",
          answer:
            "Our AI pre-screens content for potential rule violations and warns you before posting. If a post is removed by moderators, we track this information to improve future suggestions and help you understand what works in each community. We also provide detailed rule summaries for each subreddit and suggest modifications to make your content compliant.",
        },
        {
          question: "Can I get shadowbanned for using Ocera?",
          answer:
            "When used responsibly, Ocera actually reduces the risk of shadowbans by ensuring your posts follow community guidelines and maintain natural posting patterns. However, like any tool, it should be used ethically. We recommend focusing on providing value to communities rather than just promoting your content, and always following Reddit's content policy.",
        },
      ],
    },
    {
      category: "Pricing & Plans",
      questions: [
        {
          question: "What's included in the free plan?",
          answer:
            "Our free plan includes 5 posts per month, access to 3 subreddits, basic AI optimization, subreddit rule checking, community support through our help center, and access to our AI Content Optimizer. It's perfect for trying out Ocera and seeing how it works for your content strategy.",
        },
        {
          question: "What's included in the Creator plan ($19/month)?",
          answer:
            "The Creator plan includes 100 posts per month, unlimited subreddits, advanced AI optimization with custom tone settings, smart scheduling with optimal timing, comprehensive analytics dashboard, rule compliance checker, subreddit suggestions, priority email support, and access to all AI features. Perfect for content creators and small businesses.",
        },
        {
          question: "What's included in the Power User plan ($49/month)?",
          answer:
            "The Power User plan includes unlimited posts, team collaboration features, custom AI prompts and training, advanced analytics with detailed insights, API access for integrations, white-label options, dedicated support, custom integrations, and priority feature requests. Ideal for agencies and power marketers.",
        },
        {
          question: "Can I upgrade or downgrade my plan anytime?",
          answer:
            "Yes, you can change your plan at any time from your account settings. Upgrades take effect immediately with prorated billing, while downgrades take effect at the next billing cycle. You'll never lose access to your data, and we'll help you transition smoothly between plans.",
        },
      ],
    },
    {
      category: "Features & Functionality",
      questions: [
        {
          question: "Can I schedule posts for later?",
          answer:
            "Yes! Our smart scheduling feature analyzes optimal posting times for each subreddit based on when your target audience is most active. You can schedule posts hours or days in advance, and our system will distribute them at the best times for maximum engagement while maintaining anti-spam delays between posts.",
        },
        {
          question: "Does Ocera provide analytics on my posts?",
          answer:
            "Yes, we provide comprehensive analytics including karma scores, comment engagement, upvote/downvote ratios, post performance across different subreddits, best performing content types, optimal posting times, and insights to help you optimize your content strategy. Premium plans include advanced analytics with trend analysis.",
        },
        {
          question: "Can I collaborate with team members?",
          answer:
            "Team collaboration is available on our Power User plan. You can invite team members, assign different roles (admin, editor, viewer), share content drafts, coordinate posting strategies across multiple Reddit accounts, and maintain brand consistency across your team's posts.",
        },
        {
          question: "Does Ocera support images and videos?",
          answer:
            "Yes, Ocera supports text posts, image posts, and link posts. You can upload images directly through our interface, and our AI will optimize your titles and descriptions for each subreddit. Video support is coming soon, and we're working on advanced media optimization features.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What if I encounter technical issues?",
          answer:
            "Free plan users have access to community support through our comprehensive help center, FAQ, and community forums. Creator and Power User plan subscribers get priority email support with response times of 24 hours or less. Power User subscribers also get access to live chat support during business hours.",
        },
        {
          question: "Is my data secure with Ocera?",
          answer:
            "Absolutely. We use industry-standard encryption (AES-256), secure OAuth for Reddit authentication, and never store your Reddit password. Your content and account data are protected with enterprise-grade security measures, regular security audits, and compliance with data protection regulations. All data is encrypted both in transit and at rest.",
        },
        {
          question: "Can I export my data if I decide to leave?",
          answer:
            "Yes, you can export all your content, analytics data, post history, and account information at any time through your account settings. We believe in data portability and will never lock you into our platform. We also provide migration assistance for Power User subscribers.",
        },
        {
          question: "Do you have an API for developers?",
          answer:
            "Yes, API access is available for Power User subscribers. Our REST API allows you to integrate Ocera's AI optimization and posting capabilities into your own applications. We provide comprehensive documentation, SDKs for popular programming languages, and developer support.",
        },
      ],
    },
    {
      category: "Best Practices & Tips",
      questions: [
        {
          question: "How often should I post to Reddit?",
          answer:
            "Quality over quantity is key on Reddit. We recommend starting with 1-2 high-quality posts per week and gradually increasing based on your audience response. Our AI helps you maintain optimal posting frequency for each subreddit, and our analytics show you the best times to post for maximum engagement.",
        },
        {
          question: "What types of content work best on Reddit?",
          answer:
            "Reddit users value authentic, helpful, and engaging content. Educational posts, behind-the-scenes content, asking for feedback, sharing experiences, and providing value to the community typically perform well. Our AI analyzes what works in each subreddit and helps you adapt your content accordingly.",
        },
        {
          question: "How do I avoid being seen as spam?",
          answer:
            "Follow the 90/10 rule: 90% of your posts should provide value to the community, while only 10% should be promotional. Engage with comments on your posts, participate in discussions, and focus on building relationships rather than just promoting your content. Our AI helps ensure your posts provide genuine value.",
        },
        {
          question: "Should I post the same content to multiple subreddits?",
          answer:
            "While cross-posting can be effective, it's important to adapt your content for each community. Our AI automatically optimizes your content for different subreddits, changing the tone, format, and focus to match each community's preferences. This approach is much more effective than posting identical content everywhere.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-orange-600">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Everything you need to know about Ocera, our AI-powered Reddit
            posting tool. Can't find what you're looking for? Contact our
            support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-3">
                Try Ocera Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="px-8 py-3">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300 pt-2 pb-4 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Jump to the most important information
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link href="/how-it-works" className="group">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group-hover:border-orange-200 dark:group-hover:border-orange-400 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 text-gray-900 dark:text-white">
                  How It Works
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Learn how Ocera transforms your Reddit marketing
                </p>
              </div>
            </Link>
            <Link href="/pricing" className="group">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group-hover:border-orange-200 dark:group-hover:border-orange-400 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 text-gray-900 dark:text-white">
                  Pricing Plans
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose the plan that fits your needs
                </p>
              </div>
            </Link>
            <Link href="/dashboard" className="group">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group-hover:border-orange-200 dark:group-hover:border-orange-400 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 text-gray-900 dark:text-white">
                  Get Started
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Start using Ocera with our free plan
                </p>
              </div>
            </Link>
            <Link href="/contact" className="group">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group-hover:border-orange-200 dark:group-hover:border-orange-400 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 text-gray-900 dark:text-white">
                  Contact Us
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get help from our support team
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our support team is here to help. Get in touch and we'll get back to
            you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
                Contact Support
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3"
              >
                Try Ocera Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
