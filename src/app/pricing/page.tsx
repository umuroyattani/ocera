import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { CheckCircle2, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out Ocera",
      features: [
        { name: "10 posts per month", included: true },
        { name: "5 subreddits max", included: true },
        { name: "Basic AI optimization", included: true },
        { name: "Community support", included: true },
        { name: "Post scheduling", included: false },
        { name: "Analytics dashboard", included: false },
        { name: "Advanced AI features", included: false },
        { name: "Priority support", included: false },
      ],
      cta: "Get Started Free",
      popular: false,
      color: "gray",
    },
    {
      name: "Premium",
      price: "$10",
      period: "per month",
      description: "For serious content creators and marketers",
      features: [
        { name: "Unlimited posts", included: true },
        { name: "Unlimited subreddits", included: true },
        { name: "Advanced AI optimization", included: true },
        { name: "Smart scheduling", included: true },
        { name: "Analytics dashboard", included: true },
        { name: "Rule compliance checker", included: true },
        { name: "Priority support", included: true },
        { name: "API access", included: true },
      ],
      cta: "Upgrade to Premium",
      popular: true,
      color: "purple",
    },
  ];

  const faqs = [
    {
      question: "How does the free trial work?",
      answer:
        "Start with our Pro plan free for 14 days. No credit card required. You can downgrade to the free plan or upgrade anytime.",
    },
    {
      question: "What counts as a 'post'?",
      answer:
        "Each submission to a subreddit counts as one post. If you post the same content to 5 subreddits, that's 5 posts.",
    },
    {
      question: "Can I change plans anytime?",
      answer:
        "Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
    },
    {
      question: "What about Reddit API limits?",
      answer:
        "We handle all Reddit API rate limiting automatically. Your posts are queued and sent at optimal intervals to stay within limits.",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No setup fees, no hidden costs. The price you see is what you pay. Cancel anytime with no penalties.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent <span className="text-orange-600">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your Reddit marketing needs. Start free,
            upgrade when you're ready.
          </p>
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm">
            <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
              💡 All plans include AI optimization
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 relative ${
                  plan.popular
                    ? "border-orange-500 scale-105"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        {feature.included ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-gray-700 dark:text-gray-200"
                              : "text-gray-400 dark:text-gray-500"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.name === "Free" ? (
                    <Link href="/sign-up">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800">
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/sign-up">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        {plan.cta}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Compare All Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-6 font-semibold text-gray-900 dark:text-white">
                    Features
                  </th>
                  <th className="text-center p-6 font-semibold text-gray-900 dark:text-white">
                    Free
                  </th>
                  <th className="text-center p-6 font-semibold bg-purple-50 dark:bg-purple-950/20 text-gray-900 dark:text-white">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Posts per month",
                    free: "10",
                    premium: "Unlimited",
                  },
                  {
                    feature: "Subreddits",
                    free: "5 max",
                    premium: "Unlimited",
                  },
                  {
                    feature: "AI optimization",
                    free: "Basic",
                    premium: "Advanced",
                  },
                  {
                    feature: "Post scheduling",
                    free: "❌",
                    premium: "✅",
                  },
                  {
                    feature: "Analytics",
                    free: "❌",
                    premium: "Advanced",
                  },
                  {
                    feature: "Rule compliance",
                    free: "❌",
                    premium: "✅",
                  },
                  {
                    feature: "API access",
                    free: "❌",
                    premium: "✅",
                  },
                  {
                    feature: "Support",
                    free: "Community",
                    premium: "Priority",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <td className="p-6 font-medium text-gray-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="p-6 text-center text-gray-600 dark:text-gray-300">
                      {row.free}
                    </td>
                    <td className="p-6 text-center bg-purple-50 dark:bg-purple-950/20 font-medium text-gray-900 dark:text-white">
                      {row.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of creators and marketers who are already using Ocera
            to amplify their reach.
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
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3"
              >
                Contact Sales
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
