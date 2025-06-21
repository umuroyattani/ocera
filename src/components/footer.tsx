"use client";
import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate newsletter subscription
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-bold text-orange-500 mb-4 block"
            >
              Ocera
            </Link>
            <p className="text-gray-400 mb-6">
              AI-powered Reddit posting tool that helps creators and marketers
              reach more communities efficiently.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/oceraapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/company/ocera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/oceraapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Launch App
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="mailto:careers@ocera.app"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Get the latest Reddit marketing tips and product updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
                disabled={isSubscribed}
              >
                {isSubscribed ? "✓" : <Mail className="w-4 h-4" />}
              </Button>
            </form>
            {isSubscribed && (
              <p className="text-sm text-green-400 mt-2">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {currentYear} Ocera. All rights reserved.
            </div>

            <div className="flex space-x-6">
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Privacy Policy: We respect your privacy and protect your data with industry-standard security measures. We never share your personal information with third parties.",
                  );
                }}
                className="text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Terms of Service: By using Ocera, you agree to use our service responsibly and in compliance with Reddit's terms of service. We reserve the right to suspend accounts that violate our terms.",
                  );
                }}
                className="text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
              >
                Terms of Service
              </a>
              <a
                href="#api-disclaimer"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "API Disclaimer: Ocera uses Reddit's official API and is not affiliated with Reddit Inc. We comply with all API rate limits and terms of service.",
                  );
                }}
                className="text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
              >
                API Disclaimer
              </a>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 text-center md:text-left">
            <p>
              This is an unofficial Reddit client that uses Reddit's API and
              respects all Reddit rules and guidelines.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
