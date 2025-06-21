import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Users, Target, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
            About <span className="text-orange-600">Ocera</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            We're on a mission to democratize Reddit marketing with AI-powered
            tools that help creators and businesses reach their audience
            authentically.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 dark:text-white">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
              Reddit is one of the most powerful platforms for authentic
              engagement, but navigating its complex ecosystem of communities
              can be overwhelming. We built Ocera to bridge that gap, using AI
              to help you create content that resonates with each unique
              community while maintaining authenticity and compliance.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Community First
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in adding value to communities, not just promoting
                  content.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Precision Targeting
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  AI-powered matching ensures your content reaches the right
                  audience.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Efficiency
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automate the tedious parts while keeping the human touch that
                  matters.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Compliance
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Built-in safeguards ensure you never violate community
                  guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
              Our Story
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600 dark:text-gray-300">
              <p className="mb-6">
                Ocera was born from the frustration of trying to effectively
                market on Reddit. As creators and marketers ourselves, we
                experienced firsthand how challenging it can be to navigate
                Reddit's diverse ecosystem of communities, each with their own
                culture, rules, and expectations.
              </p>
              <p className="mb-6">
                We spent countless hours researching subreddit rules, adapting
                content for different audiences, and trying to time our posts
                perfectly. Despite our best efforts, we often saw our content
                removed or ignored because it didn't quite fit the community's
                expectations.
              </p>
              <p className="mb-6">
                That's when we realized the power of AI could be harnessed to
                solve this problem. By analyzing successful posts, community
                patterns, and subreddit rules, we could create a tool that helps
                anyone create content that truly resonates with Reddit
                communities.
              </p>
              <p>
                Today, Ocera helps thousands of creators, marketers, and
                businesses reach their audience on Reddit more effectively while
                maintaining the authenticity and community-first approach that
                makes Reddit special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                  Authenticity
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe authentic engagement beats promotional spam every
                  time. Our tools help you create genuine value for communities.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                  Transparency
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're open about how our AI works and committed to helping
                  users understand Reddit's ecosystem better.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                  Responsibility
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We build safeguards into our platform to prevent spam and
                  ensure users follow Reddit's guidelines and community rules.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                  Innovation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We continuously improve our AI models and features based on
                  user feedback and the evolving Reddit landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to join our mission?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Help us make Reddit marketing more authentic and effective for
            everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
