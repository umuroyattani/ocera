import DashboardNavbar from "@/components/dashboard-navbar";
import {
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Activity,
  Star,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import AIContentOptimizer from "@/components/ai-content-optimizer";
import AISubredditSuggestions from "@/components/ai-subreddit-suggestions";
import RedditConnectionCard from "@/components/reddit-connection-card";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow access without login - create demo user data
  let userData = null;
  if (user) {
    // Fetch user data from database if logged in
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    userData = data;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <DashboardNavbar user={user} userData={userData} />
      <DashboardClient user={user} userData={userData} />
    </div>
  );
}
