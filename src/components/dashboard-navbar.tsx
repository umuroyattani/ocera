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
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-lemonsqueezy-checkout",
        {
          body: {
            plan: "premium",
            userId: user.id,
          },
        },
      );

      if (error) {
        console.error("Error creating checkout:", error);
        alert("Failed to create checkout session. Please try again.");
        return;
      }

      if (data?.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data?.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Something went wrong. Please try again.");
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
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md py-3 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            prefetch
            className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
          >
            Ocera
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard?tab=create">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </Link>
            <Link href="/dashboard?tab=history">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/dashboard?tab=schedule">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <Clock className="w-4 h-4" />
                Schedule
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Plan Badge */}
          <div className="hidden md:block">{getPlanBadge()}</div>

          {/* Upgrade Button for Free Users */}
          {userData?.subscription_plan !== "premium" && (
            <Button
              size="sm"
              variant="outline"
              className="hidden md:flex bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
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
            className="hidden md:flex bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0"
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
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-2">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <div className="mt-2">{getPlanBadge()}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard?tab=settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
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
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-1">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
            </Link>
            <Link
              href="/dashboard?tab=create"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="ghost" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-3" />
                Create Post
              </Button>
            </Link>
            <Link
              href="/dashboard?tab=history"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-3" />
                Analytics
              </Button>
            </Link>
            <Link
              href="/dashboard?tab=schedule"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="ghost" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-3" />
                Schedule
              </Button>
            </Link>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
              {userData?.subscription_plan !== "premium" && (
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
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
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0"
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
