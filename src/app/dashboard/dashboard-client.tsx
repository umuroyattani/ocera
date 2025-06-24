"use client";

import { useState, useEffect } from "react";
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
import { createClient } from "../../../supabase/client";
import { useSearchParams } from "next/navigation";

interface DashboardClientProps {
  user: any;
  userData: any;
}

export default function DashboardClient({
  user,
  userData,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    postsThisMonth: 0,
    totalKarma: 0,
    scheduledPosts: 0,
    successRate: 0,
    totalViews: 0,
    engagementRate: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRedditAnalytics();
  }, [userData]);

  const fetchRedditAnalytics = async () => {
    if (!userData?.reddit_connected || !userData?.reddit_access_token) {
      // Use mock data if Reddit not connected
      setStats({
        postsThisMonth: 24,
        totalKarma: 3247,
        scheduledPosts: 7,
        successRate: 92,
        totalViews: 15420,
        engagementRate: 8.4,
      });

      setRecentPosts([
        {
          id: 1,
          title: "How to Build a Successful SaaS Product",
          subreddit: "r/entrepreneur",
          karma: 156,
          comments: 23,
          status: "published",
          publishedAt: "2 hours ago",
        },
        {
          id: 2,
          title: "Best Practices for React Development",
          subreddit: "r/reactjs",
          karma: 89,
          comments: 12,
          status: "published",
          publishedAt: "1 day ago",
        },
        {
          id: 3,
          title: "Marketing Strategies for 2024",
          subreddit: "r/marketing",
          karma: 0,
          comments: 0,
          status: "scheduled",
          publishedAt: "Tomorrow at 9:00 AM",
        },
      ]);

      setUpcomingPosts([
        {
          id: 1,
          title: "AI Tools for Content Creation",
          subreddit: "r/artificial",
          scheduledFor: "Today at 3:00 PM",
          status: "ready",
        },
        {
          id: 2,
          title: "Remote Work Best Practices",
          subreddit: "r/remotework",
          scheduledFor: "Tomorrow at 10:00 AM",
          status: "ready",
        },
      ]);

      setIsLoading(false);
      return;
    }

    try {
      // Fetch real Reddit analytics
      const response = await fetch("/api/reddit/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: userData.reddit_access_token,
          username: userData.reddit_username,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(
          data.stats || {
            postsThisMonth: 0,
            totalKarma: data.karma || 0,
            scheduledPosts: 0,
            successRate: 0,
            totalViews: 0,
            engagementRate: 0,
          },
        );
        setRecentPosts(data.recentPosts || []);
      }
    } catch (error) {
      console.error("Error fetching Reddit analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    setActiveTab("create");
  };

  const handleOptimizeContent = () => {
    setActiveTab("create");
    // Scroll to AI optimizer section
    setTimeout(() => {
      const element = document.querySelector("[data-ai-optimizer]");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back
              {userData?.reddit_username
                ? `, u/${userData.reddit_username}`
                : ""}
              ! 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Ready to create your next viral Reddit post?
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleCreatePost}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Post
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
              onClick={handleOptimizeContent}
            >
              <Zap className="w-5 h-5 mr-2" />
              AI Optimize
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Posts This Month
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.postsThisMonth}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Karma
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalKarma.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +8% this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Scheduled Posts
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.scheduledPosts}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Next in 2 hours
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Success Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.successRate}%
                  </p>
                  <Progress value={stats.successRate} className="mt-2 h-2" />
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-yellow-200 dark:hover:border-yellow-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Views
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Last 30 days
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-pink-200 dark:hover:border-pink-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Engagement
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.engagementRate}%
                  </p>
                  <p className="text-xs text-pink-600 flex items-center mt-1">
                    <Star className="w-3 h-3 mr-1" />
                    Above average
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 border shadow-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Create Post
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Post History
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Scheduled
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-orange-600" />
                    Recent Posts
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Your latest Reddit posts and their performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium text-orange-600">
                              {post.subreddit}
                            </span>
                            <span>{post.publishedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {post.karma}
                            </div>
                            <div className="text-xs text-gray-500">karma</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {post.comments}
                            </div>
                            <div className="text-xs text-gray-500">
                              comments
                            </div>
                          </div>
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Upcoming */}
            <div className="space-y-6">
              <RedditConnectionCard />

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Upcoming Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className="p-3 border dark:border-gray-700 rounded-lg"
                      >
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {post.title}
                        </h5>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-600 font-medium">
                            {post.subreddit}
                          </span>
                          <span className="text-gray-500">
                            {post.scheduledFor}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("schedule")}
                  >
                    View All Scheduled
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Create Post Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div data-ai-optimizer>
                <AIContentOptimizer userData={userData} user={user} />
              </div>
            </div>
            <div className="space-y-6">
              <AISubredditSuggestions userData={userData} user={user} />
              <RedditConnectionCard />
            </div>
          </div>
        </TabsContent>

        {/* Post History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                Post Analytics
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Track your posts across all subreddits with detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-orange-600">
                          {post.subreddit}
                        </span>
                        <span>{post.publishedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {post.karma}
                        </div>
                        <div className="text-xs text-gray-500">karma</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {post.comments}
                        </div>
                        <div className="text-xs text-gray-500">comments</div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Posts Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Scheduled Posts
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Manage your scheduled Reddit posts and posting calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPosts.map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-6 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                        >
                          {post.subreddit}
                        </Badge>
                        <span className="text-gray-600 dark:text-gray-300 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.scheduledFor}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="text-center">
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => setActiveTab("create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule New Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RedditConnectionCard />

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Account Preferences
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get notified about post performance and updates
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Auto-Scheduling
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Automatically schedule posts for optimal times
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        API Access
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Manage your API keys and integrations
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Data Export
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Export your posts and analytics data
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
