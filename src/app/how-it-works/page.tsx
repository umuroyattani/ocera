import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Reddit",
      description:
        "Securely link your Reddit account using OAuth2. We never store your password.",
      icon: <Users className="w-8 h-8" />,
      details: [
        "One-click OAuth2 authentication",
        "Secure token management",
        "Full Reddit API access",
      ],
    },
    {
      number: "02",
      title: "Write One Post",
      description:
        "Create your content once. Our AI will adapt it for different communities.",
      icon: <Bot className="w-8 h-8" />,
      details: [
        "Rich text editor",
        "Image and link support",
        "Preview before posting",
      ],
    },
    {
      number: "03",
      title: "Customize with AI",
      description:
        "Our AI analyzes each subreddit and optimizes your content automatically.",
      icon: <Zap className="w-8 h-8" />,
      details: [
        "Tone adjustment per subreddit",
        "Rule compliance checking",
        "Engagement optimization",
      ],
    },
    {
      number: "04",
      title: "Select Subreddits",
      description:
        "Choose from thousands of communities or let our AI suggest the best matches.",
      icon: <Target className="w-8 h-8" />,
      details: [
        "Smart subreddit recommendations",
        "Rule summaries",
        "Engagement predictions",
      ],
    },
    {
      number: "05",
      title: "Post with Smart Delays",
      description:
        "Schedule posts with optimal timing and anti-spam delays built-in.",
      icon: <Clock className="w-8 h-8" />,
      details: [
        "Optimal timing analysis",
        "Anti-spam protection",
        "Real-time status updates",
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
            How <span className="text-orange-600">Ocera</span> Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            From content creation to multi-community posting in 5 simple steps.
            See how our AI-powered platform transforms your Reddit marketing
            strategy.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center mb-16 last:mb-0"
              >
                <div
                  className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:order-2"}`}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-4">
                      {step.icon}
                    </div>
                    <span className="text-4xl font-bold text-gray-200">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`md:w-1/2 mt-8 md:mt-0 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:order-1"}`}
                >
                  <div className="bg-gradient-to-br from-orange-100 to-purple-100 rounded-2xl p-8 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        {step.icon}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Step {step.number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Powered by Advanced AI
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI doesn't just post your content—it understands Reddit's
              unique culture and optimizes for maximum engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Subreddit Analysis",
                description:
                  "AI analyzes posting patterns, popular content types, and community preferences",
                icon: <Target className="w-6 h-6" />,
              },
              {
                title: "Rule Compliance",
                description:
                  "Automatically checks your content against each subreddit's rules and guidelines",
                icon: <CheckCircle2 className="w-6 h-6" />,
              },
              {
                title: "Tone Adaptation",
                description:
                  "Adjusts writing style from casual to professional based on community culture",
                icon: <Bot className="w-6 h-6" />,
              },
              {
                title: "Optimal Timing",
                description:
                  "Posts when your target audience is most active for maximum visibility",
                icon: <Clock className="w-6 h-6" />,
              },
              {
                title: "Spam Prevention",
                description:
                  "Built-in delays and posting patterns that keep your account safe",
                icon: <Zap className="w-6 h-6" />,
              },
              {
                title: "Performance Tracking",
                description:
                  "Real-time analytics on karma, comments, and engagement across all posts",
                icon: <Users className="w-6 h-6" />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
              >
                <div className="text-orange-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Walkthrough */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              See It In Action
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Here's how Ocera would adapt a single post for different
              communities
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Original Post:
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-200">
                    "I built a productivity app that helps you focus by blocking
                    distracting websites. It uses AI to learn your habits and
                    suggests better work patterns."
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-600 mb-2">
                    For r/productivity
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Tone: Professional, benefit-focused
                  </p>
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    "Struggling with digital distractions? I developed an
                    AI-powered focus app that learns your work patterns and
                    blocks distracting sites automatically. Early users report
                    40% better focus. Would love feedback from this community!"
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-600 mb-2">
                    For r/SideProject
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Tone: Casual, maker-focused
                  </p>
                  <div className="bg-green-50 p-3 rounded text-sm">
                    "Hey makers! Just shipped my first AI-powered productivity
                    app 🚀 It learns your browsing habits and blocks
                    distractions automatically. Built with React and Python.
                    What do you think?"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to try it yourself?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start with our free plan and see how AI can transform your Reddit
            marketing strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3"
              >
                View Pricing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
