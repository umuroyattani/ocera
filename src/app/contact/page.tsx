import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ContactForm from "@/components/contact-form";
import {
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  Phone,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-purple-600/10 dark:from-orange-600/5 dark:to-purple-600/5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
          >
            24/7 Support Available
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            We're Here to <span className="text-orange-600">Help</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Have questions about Ocera? Need help with your Reddit marketing
            strategy? Our expert team is ready to assist you every step of the
            way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send us a Message
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Phone className="w-5 h-5 mr-2" />
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the contact method that works best for you. We're committed
              to providing fast, helpful responses to all your questions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-orange-200 dark:hover:border-orange-800">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                  Email Support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Get detailed help via email with our support team
                </p>
                <a
                  href="mailto:support@ocera.app"
                  className="text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors"
                >
                  support@ocera.app
                </a>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs">
                    Usually responds in 2-4 hours
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                  Live Chat
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Chat with our team in real-time for quick answers
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() =>
                    alert(
                      "Live chat feature coming soon! Please use email for immediate assistance.",
                    )
                  }
                >
                  Start Chat
                </Button>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-200 dark:hover:border-green-800">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                  Response Time
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  We pride ourselves on fast, helpful responses
                </p>
                <div className="space-y-2">
                  <div className="text-green-600 font-bold text-lg">
                    &lt; 24 hours
                  </div>
                  <div className="text-xs text-gray-500">
                    Average response time
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                  Our Location
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Based in the heart of tech innovation
                </p>
                <div className="space-y-1">
                  <div className="text-purple-600 font-semibold">
                    San Francisco, CA
                  </div>
                  <div className="text-xs text-gray-500">Pacific Time Zone</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out the form below and we'll get back to you as soon as
                possible
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ and Resources */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <HelpCircle className="w-16 h-16 text-orange-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Quick Help Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Before reaching out, check these resources for instant answers to
              common questions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold text-sm">1</span>
                  </div>
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Learn how to set up your account, connect Reddit, and create
                  your first post
                </p>
                <div className="space-y-3">
                  <a
                    href="/faq#getting-started"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → Account Setup Guide
                  </a>
                  <a
                    href="/faq#reddit-connection"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → Reddit Connection Help
                  </a>
                  <a
                    href="/how-it-works"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → How Ocera Works
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  Pricing & Billing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Understand our pricing plans, billing cycles, and upgrade
                  options
                </p>
                <div className="space-y-3">
                  <a
                    href="/pricing"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → View All Plans
                  </a>
                  <a
                    href="/faq#billing"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → Billing Questions
                  </a>
                  <a
                    href="/faq#upgrades"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → Upgrade Your Plan
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Troubleshoot common issues and get technical assistance
                </p>
                <div className="space-y-3">
                  <a
                    href="/faq#technical"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → Troubleshooting Guide
                  </a>
                  <a
                    href="/faq#api-issues"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → API & Connection Issues
                  </a>
                  <a
                    href="/faq#browser-support"
                    className="block text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                  >
                    → Browser Compatibility
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-16" />

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Still need help?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our support team is standing by to help you succeed with Reddit
              marketing
            </p>
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
