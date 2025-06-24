"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
  Bot,
  Clock,
  Target,
  BarChart3,
  Star,
  Rocket,
  TrendingUp,
  MessageSquare,
  Globe,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              AI-Powered Reddit Marketing
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Dominate Reddit with AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your Reddit presence with intelligent content
              optimization, multi-community posting, and data-driven insights
              that actually work.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {user ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Go to Dashboard
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Free Trial
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Link href={user ? "/account" : "/dashboard"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  {user ? "Account Settings" : "View Dashboard"}
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "10K+", label: "Active Users" },
                { number: "500K+", label: "Posts Created" },
                { number: "95%", label: "Success Rate" },
                { number: "24/7", label: "AI Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive suite of AI-powered tools takes the guesswork
              out of Reddit marketing
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: <Bot className="w-8 h-8" />,
                title: "AI Content Optimization",
                description:
                  "Automatically adapt your content for each subreddit's unique culture, rules, and audience preferences",
                features: [
                  "Smart tone adjustment",
                  "Rule compliance check",
                  "Engagement prediction",
                ],
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Multi-Community Posting",
                description:
                  "Reach dozens of relevant subreddits simultaneously with intelligent targeting and timing",
                features: [
                  "Smart subreddit matching",
                  "Bulk posting",
                  "Anti-spam protection",
                ],
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Advanced Analytics",
                description:
                  "Track performance, optimize strategies, and maximize your Reddit ROI with detailed insights",
                features: [
                  "Real-time metrics",
                  "Engagement tracking",
                  "ROI analysis",
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800"
              >
                <div className="text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Smart Scheduling",
                description:
                  "Post at optimal times with built-in spam prevention",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Compliance First",
                description: "Stay within Reddit's guidelines automatically",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Growth Tracking",
                description: "Monitor karma and engagement growth",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Global Reach",
                description: "Target communities worldwide effectively",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800 transition-colors duration-300"
              >
                <div className="text-orange-600 dark:text-orange-400 mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-semibold mb-2 text-black dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
              Trusted by Reddit marketers worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our community is saying about their results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Sarah Chen",
                role: "Content Creator",
                avatar: "SC",
                content:
                  "Increased my Reddit karma by 400% in just 6 weeks. The AI suggestions are incredibly accurate and save me hours of research.",
                rating: 5,
                metric: "+400% karma",
              },
              {
                name: "Mike Rodriguez",
                role: "Marketing Manager",
                avatar: "MR",
                content:
                  "This tool transformed our Reddit strategy. We're now reaching 10x more communities with better engagement rates.",
                rating: 5,
                metric: "10x reach",
              },
              {
                name: "Alex Thompson",
                role: "Indie Developer",
                avatar: "AT",
                content:
                  "Finally got my app noticed on Reddit. The subreddit targeting is brilliant - it knows exactly where my audience hangs out.",
                rating: 5,
                metric: "50K+ views",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-black dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                  <div className="ml-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {testimonial.metric}
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
              Choose your growth plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for trying out Ocera",
                features: [
                  "10 posts per month",
                  "5 subreddits max",
                  "Basic AI optimization",
                  "Community support",
                  "Basic analytics",
                ],
                cta: "Get Started Free",
                popular: false,
                highlight: false,
              },
              {
                name: "Premium",
                price: "$10",
                period: "per month",
                description: "For serious content creators and marketers",
                features: [
                  "Unlimited posts",
                  "Unlimited subreddits",
                  "Advanced AI optimization",
                  "Smart scheduling",
                  "Analytics dashboard",
                  "Rule compliance checker",
                  "Priority support",
                  "API access",
                ],
                cta: "Upgrade to Premium",
                popular: true,
                highlight: true,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                  plan.highlight
                    ? "border-orange-500 bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 shadow-xl scale-105"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:border-orange-200 dark:hover:border-orange-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-black dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={
                    plan.name === "Free"
                      ? "/sign-up"
                      : user
                        ? "/dashboard"
                        : "/sign-up"
                  }
                >
                  <Button
                    className={`w-full py-3 font-semibold transition-all duration-300 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                        : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white"
                    }`}
                    onClick={
                      plan.name === "Premium" && user
                        ? async (e) => {
                            e.preventDefault();
                            try {
                              const { data, error } =
                                await supabase.functions.invoke(
                                  "supabase-functions-lemonsqueezy-checkout",
                                  {
                                    body: {
                                      plan: "premium",
                                      userId: user.id,
                                    },
                                  },
                                );
                              if (error) throw error;
                              if (data?.success && data.checkoutUrl) {
                                window.location.href = data.checkoutUrl;
                              }
                            } catch (error) {
                              console.error("Checkout error:", error);
                              alert(
                                "Failed to create checkout session. Please try again.",
                              );
                            }
                          }
                        : undefined
                    }
                  >
                    {plan.name === "Premium" && user ? "Upgrade Now" : plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question:
                  "Is this tool compliant with Reddit's terms of service?",
                answer:
                  "Absolutely. Our platform uses Reddit's official API and strictly follows all posting guidelines. We include built-in safeguards to prevent spam, respect rate limits, and ensure full compliance with Reddit's terms of service.",
              },
              {
                question: "How does the AI content optimization actually work?",
                answer:
                  "Our AI analyzes each subreddit's rules, posting patterns, successful content, and community culture. It then adapts your content's tone, format, timing, and style to maximize engagement while ensuring compliance with each community's specific requirements.",
              },
              {
                question: "Can I schedule posts for different time zones?",
                answer:
                  "Yes! Our smart scheduler automatically posts at optimal times for each subreddit's audience, taking into account different time zones and peak activity periods. Anti-spam delays are built-in to maintain account health.",
              },
              {
                question: "What happens if my post violates a subreddit rule?",
                answer:
                  "Our AI pre-screens all content for potential rule violations and warns you before posting. We maintain an up-to-date database of subreddit rules and provide detailed compliance reports for each post.",
              },
              {
                question: "Do you offer refunds if I'm not satisfied?",
                answer:
                  "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not completely satisfied with the results, contact our support team for a full refund.",
              },
              {
                question: "How quickly can I see results?",
                answer:
                  "Most users see improved engagement within the first week of using our platform. Significant karma growth and increased visibility typically occur within 2-4 weeks of consistent, optimized posting.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800 transition-colors duration-300"
              >
                <h3 className="font-bold text-xl mb-4 text-black dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your Reddit presence?
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Join thousands of creators, marketers, and businesses who are
            already using AI to amplify their Reddit success. Start your free
            trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-4 text-lg font-bold transition-all duration-300"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
