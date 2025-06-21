"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { User, UserCircle, Menu } from "lucide-react";
import UserProfile from "./user-profile";
import { ThemeSwitcher } from "./theme-switcher";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:bg-black dark:border-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-2xl font-bold text-orange-600">
          Ocera
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-4 items-center">
          <ThemeSwitcher />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Launch App
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
              >
                Login
              </Link>
              <Link href="/dashboard">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Launch App
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 font-medium py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                  {user ? (
                    <div className="space-y-2">
                      <Link href="/dashboard" className="block">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          Launch App
                        </Button>
                      </Link>
                      <div className="flex justify-center">
                        <UserProfile />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/sign-in" className="block">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/dashboard" className="block">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                          Launch App
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
