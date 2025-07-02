"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  UserCircle,
  Home,
  Plus,
  BarChart3,
  Settings,
  Clock,
  Crown,
  Menu,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import { useState } from "react";
import { User } from "@supabase/supabase-js";

interface DashboardNavbarProps {
  user?: User | null;
  userData?: any;
}

export default function DashboardNavbar({
  user,
  userData,
}: DashboardNavbarProps) {
  const supabase = createClient();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user?.id) {
      alert("Please log in to upgrade your plan");
      return;
    }

    setUpgradeLoading(true);

    try {
      console.log("Starting Paystack checkout process for user:", user.id);

      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-paystack-checkout",
        {
          body: {
            plan: "premium",
            userId: user.id,
            email: user.email,
          },
        },
      );

      console.log("Paystack checkout response:", { data, error });

      if (error) {
        console.error("Error creating checkout:", error);
        alert(
          `Failed to create checkout session: ${error.message || "Unknown error"}. Please try again.`,
        );
        return;
      }

      if (data?.success && data.checkoutUrl) {
        console.log("Opening Paystack checkout:", data.checkoutUrl);
        // Open Paystack checkout in a new window
        const popup = window.open(
          data.checkoutUrl,
          "paystack-checkout",
          "width=500,height=700,scrollbars=yes,resizable=yes",
        );

        if (!popup) {
          // Fallback to redirect if popup is blocked
          window.location.href = data.checkoutUrl;
        }
      } else {
        console.error("Invalid checkout response:", data);
        throw new Error(data?.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert(
        `Something went wrong: ${error.message || "Unknown error"}. Please try again.`,
      );
    } finally {
      setUpgradeLoading(false);
    }
  };

  const getPlanBadge = () => {
    const plan = userData?.subscription_plan || "free";
    switch (plan) {
      case "premium":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600 dark:text-gray-300">
            Free
          </Badge>
        );
    }
  };

  return (
    <nav className="w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            prefetch
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            Ocera
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard?tab=create">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </Link>
            <Link href="/dashboard?tab=history">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/dashboard?tab=schedule">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <Clock className="w-4 h-4" />
                Schedule
              </Button>
            </Link>
            <Link href="/account">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {/* Plan Badge */}
          <div className="hidden md:block">{getPlanBadge()}</div>

          {/* Upgrade Button for Free Users */}
          {userData?.subscription_plan !== "premium" && (
            <Button
              size="sm"
              className="hidden md:flex bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
            >
              <Crown className="w-4 h-4 mr-2" />
              {upgradeLoading ? "Loading..." : "Upgrade $10/mo"}
            </Button>
          )}

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* New Post Button */}
          <Button
            size="sm"
            className="hidden md:flex bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => router.push("/dashboard?tab=create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110"
              >
                <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-2">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <div className="mt-2">{getPlanBadge()}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/account")}>
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              {userData?.subscription_plan !== "premium" && (
                <DropdownMenuItem
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="text-purple-600 dark:text-purple-400"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {upgradeLoading
                    ? "Loading..."
                    : "Upgrade to Premium ($10/mo)"}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                  router.refresh();
                }}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl">
          <div className="px-6 py-6 space-y-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-all duration-200"
              >
                <Home className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
            </Link>
            <Link
              href="/dashboard?tab=create"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-3" />
                Create Post
              </Button>
            </Link>
            <Link
              href="/dashboard?tab=history"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Analytics
              </Button>
            </Link>
            <Link
              href="/dashboard?tab=schedule"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-all duration-200"
              >
                <Clock className="w-4 h-4 mr-3" />
                Schedule
              </Button>
            </Link>
            <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                <Settings className="w-4 h-4 mr-3" />
                Account
              </Button>
            </Link>
            <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-3">
              {userData?.subscription_plan !== "premium" && (
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    handleUpgrade();
                    setMobileMenuOpen(false);
                  }}
                  disabled={upgradeLoading}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {upgradeLoading ? "Loading..." : "Upgrade $10/mo"}
                </Button>
              )}
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  router.push("/dashboard?tab=create");
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
