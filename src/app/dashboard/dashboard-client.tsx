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
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  Mail,
  Crown,
  Globe,
  Heart,
  Share,
  Bookmark,
  Filter,
  Search,
  Send,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
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
  const [redditData, setRedditData] = useState({
    userInfo: null,
    posts: [],
    subreddits: [],
    messages: [],
    stats: {
      totalKarma: 0,
      linkKarma: 0,
      commentKarma: 0,
      postsThisMonth: 0,
      commentsThisMonth: 0,
      avgUpvotes: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    subreddit: "",
  });
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    text: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("new");

  const supabase = createClient();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (userData?.reddit_connected) {
      fetchAllRedditData();
    } else {
      setIsLoading(false);
    }
  }, [userData]);

  const fetchAllRedditData = async () => {
    if (!userData?.reddit_connected) return;

    setIsLoading(true);
    try {
      const authHeader = `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`;

      // Fetch user info
      const userInfoResponse = await supabase.functions.invoke(
        "supabase-functions-reddit-user-info",
        {
          headers: { Authorization: authHeader },
        },
      );

      // Fetch user posts
      const postsResponse = await supabase.functions.invoke(
        "supabase-functions-reddit-posts",
        {
          body: { action: "user_posts", sort: "new", limit: 25 },
          headers: { Authorization: authHeader },
        },
      );

      // Fetch subscribed subreddits
      const subredditsResponse = await supabase.functions.invoke(
        "supabase-functions-reddit-subreddits",
        {
          body: { action: "my_subreddits" },
          headers: { Authorization: authHeader },
        },
      );

      // Fetch messages
      const messagesResponse = await supabase.functions.invoke(
        "supabase-functions-reddit-messages",
        {
          body: { action: "inbox" },
          headers: { Authorization: authHeader },
        },
      );

      const userInfo = userInfoResponse.data?.success
        ? userInfoResponse.data.data
        : null;
      const posts = postsResponse.data?.success
        ? postsResponse.data.data.posts || []
        : [];
      const subreddits = subredditsResponse.data?.success
        ? subredditsResponse.data.data.data?.children || []
        : [];
      const messages = messagesResponse.data?.success
        ? messagesResponse.data.data.messages || []
        : [];

      // Calculate stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const postsThisMonth = posts.filter(
        (post: any) => new Date(post.created_utc * 1000) >= thisMonth,
      ).length;

      const totalUpvotes = posts.reduce(
        (sum: number, post: any) => sum + (post.score || 0),
        0,
      );
      const avgUpvotes =
        posts.length > 0 ? Math.round(totalUpvotes / posts.length) : 0;

      setRedditData({
        userInfo,
        posts,
        subreddits,
        messages,
        stats: {
          totalKarma: userInfo?.total_karma || 0,
          linkKarma: userInfo?.link_karma || 0,
          commentKarma: userInfo?.comment_karma || 0,
          postsThisMonth,
          commentsThisMonth: 0, // Would need separate API call
          avgUpvotes,
        },
      });
    } catch (error) {
      console.error("Error fetching Reddit data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch Reddit data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllRedditData();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Reddit data has been updated.",
    });
  };

  const handleVote = async (postId: string, direction: number) => {
    try {
      const authHeader = `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`;
      const response = await supabase.functions.invoke(
        "supabase-functions-reddit-vote",
        {
          body: { thing_id: postId, direction },
          headers: { Authorization: authHeader },
        },
      );

      if (response.data?.success) {
        toast({
          title: "Vote submitted",
          description: `Successfully ${direction === 1 ? "upvoted" : direction === -1 ? "downvoted" : "removed vote on"} post.`,
        });
        // Refresh posts to show updated scores
        await fetchAllRedditData();
      } else {
        throw new Error(response.data?.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const authHeader = `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`;
      const response = await supabase.functions.invoke(
        "supabase-functions-reddit-delete-post",
        {
          body: { thing_id: postId },
          headers: { Authorization: authHeader },
        },
      );

      if (response.data?.success) {
        toast({
          title: "Post deleted",
          description: "Post has been successfully deleted.",
        });
        await fetchAllRedditData();
      } else {
        throw new Error(response.data?.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.subreddit) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const authHeader = `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`;
      const response = await supabase.functions.invoke(
        "supabase-functions-reddit-post",
        {
          body: {
            title: newPost.title,
            content: newPost.content,
            subreddit: newPost.subreddit,
          },
          headers: { Authorization: authHeader },
        },
      );

      if (response.data?.success) {
        toast({
          title: "Post created",
          description: "Your post has been successfully submitted to Reddit.",
        });
        setNewPost({ title: "", content: "", subreddit: "" });
        await fetchAllRedditData();
      } else {
        throw new Error(response.data?.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.text) {
      toast({
        title: "Error",
        description: "Please fill in all message fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const authHeader = `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`;
      const response = await supabase.functions.invoke(
        "supabase-functions-reddit-messages",
        {
          body: {
            action: "compose",
            to: newMessage.to,
            subject: newMessage.subject,
            text: newMessage.text,
          },
          headers: { Authorization: authHeader },
        },
      );

      if (response.data?.success) {
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
        });
        setNewMessage({ to: "", subject: "", text: "" });
      } else {
        throw new Error(response.data?.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = redditData.posts.filter(
    (post: any) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subreddit.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Show demo data if Reddit is not connected
  if (!userData?.reddit_connected) {
    // Set demo data for showcase
    const demoData = {
      userInfo: {
        name: "demo_user",
        total_karma: 15420,
        link_karma: 8950,
        comment_karma: 6470,
        created_utc: 1577836800, // Jan 1, 2020
        is_gold: false,
        has_verified_email: true,
      },
      posts: [
        {
          id: "demo1",
          title: "How AI is revolutionizing Reddit marketing strategies",
          subreddit: "marketing",
          score: 342,
          num_comments: 28,
          created_utc: Date.now() / 1000 - 86400, // 1 day ago
          permalink: "/r/marketing/comments/demo1/",
          selftext:
            "Exploring the latest trends in AI-powered social media marketing...",
        },
        {
          id: "demo2",
          title: "Best practices for multi-subreddit posting",
          subreddit: "socialmedia",
          score: 156,
          num_comments: 15,
          created_utc: Date.now() / 1000 - 172800, // 2 days ago
          permalink: "/r/socialmedia/comments/demo2/",
          selftext:
            "A comprehensive guide to posting across multiple communities...",
        },
        {
          id: "demo3",
          title: "The future of content optimization",
          subreddit: "technology",
          score: 89,
          num_comments: 12,
          created_utc: Date.now() / 1000 - 259200, // 3 days ago
          permalink: "/r/technology/comments/demo3/",
          selftext:
            "Discussing how AI can help optimize content for different audiences...",
        },
      ],
      subreddits: [
        {
          data: {
            id: "demo_sub1",
            display_name: "marketing",
            subscribers: 2500000,
            public_description:
              "A community for marketing professionals and enthusiasts",
            title: "Marketing",
          },
        },
        {
          data: {
            id: "demo_sub2",
            display_name: "socialmedia",
            subscribers: 1200000,
            public_description:
              "Discussion about social media platforms and strategies",
            title: "Social Media",
          },
        },
        {
          data: {
            id: "demo_sub3",
            display_name: "technology",
            subscribers: 8500000,
            public_description: "The latest in technology news and discussion",
            title: "Technology",
          },
        },
      ],
      messages: [
        {
          id: "demo_msg1",
          subject: "Great post about AI marketing!",
          author: "marketing_pro",
          body: "Really enjoyed your insights on AI-powered marketing strategies. Would love to collaborate!",
          created_utc: Date.now() / 1000 - 43200, // 12 hours ago
          new: true,
        },
        {
          id: "demo_msg2",
          subject: "Question about multi-posting",
          author: "reddit_newbie",
          body: "Hi! I saw your post about multi-subreddit posting. Could you share some tips for beginners?",
          created_utc: Date.now() / 1000 - 86400, // 1 day ago
          new: false,
        },
      ],
      stats: {
        totalKarma: 15420,
        linkKarma: 8950,
        commentKarma: 6470,
        postsThisMonth: 8,
        commentsThisMonth: 24,
        avgUpvotes: 196,
      },
    };

    // Override the redditData with demo data
    if (redditData.posts.length === 0) {
      setRedditData(demoData);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Ocera Dashboard
              {redditData.userInfo?.name
                ? `, u/${redditData.userInfo.name}`
                : ""}
              ! 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {userData?.reddit_connected
                ? "Your Reddit dashboard with real-time data and analytics"
                : "Demo dashboard - Connect your Reddit account for real data"}
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button
              size="lg"
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => setActiveTab("create")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
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
                    Total Karma
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {redditData.stats.totalKarma.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Link: {redditData.stats.linkKarma}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Comment Karma
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {redditData.stats.commentKarma.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    From comments
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Posts This Month
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {redditData.stats.postsThisMonth}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Recent activity
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Avg Upvotes
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {redditData.stats.avgUpvotes}
                  </p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    Per post
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-2 hover:border-yellow-200 dark:hover:border-yellow-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Subreddits
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {redditData.subreddits.length}
                  </p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    Subscribed
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
                    Messages
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {redditData.messages.length}
                  </p>
                  <p className="text-xs text-pink-600 flex items-center mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    In inbox
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-pink-600" />
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
        <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-gray-800 border shadow-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            My Posts
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Create Post
          </TabsTrigger>
          <TabsTrigger
            value="subreddits"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Subreddits
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Messages
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
            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-orange-600" />
                    Recent Posts
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {userData?.reddit_connected
                      ? "Your latest Reddit posts and their performance"
                      : "Demo posts - Connect Reddit for your actual posts"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {redditData.posts.slice(0, 5).map((post: any) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium text-orange-600">
                              r/{post.subreddit}
                            </span>
                            <span>
                              {new Date(
                                post.created_utc * 1000,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {post.score}
                            </div>
                            <div className="text-xs text-gray-500">score</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {post.num_comments}
                            </div>
                            <div className="text-xs text-gray-500">
                              comments
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `https://reddit.com${post.permalink}`,
                                "_blank",
                              )
                            }
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-600" />
                    Account Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Account Age
                      </span>
                      <span className="font-semibold">
                        {redditData.userInfo?.created_utc
                          ? Math.floor(
                              (Date.now() -
                                redditData.userInfo.created_utc * 1000) /
                                (1000 * 60 * 60 * 24 * 365),
                            )
                          : 0}{" "}
                        years
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Gold Status
                      </span>
                      <Badge
                        variant={
                          redditData.userInfo?.is_gold ? "default" : "secondary"
                        }
                      >
                        {redditData.userInfo?.is_gold ? "Gold" : "Regular"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Verified Email
                      </span>
                      <Badge
                        variant={
                          redditData.userInfo?.has_verified_email
                            ? "default"
                            : "destructive"
                        }
                      >
                        {redditData.userInfo?.has_verified_email
                          ? "Verified"
                          : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <RedditConnectionCard />
            </div>
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                    My Reddit Posts ({redditData.posts.length})
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {userData?.reddit_connected
                      ? "Manage and analyze your Reddit posts"
                      : "Demo posts - Connect Reddit to manage your actual posts"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Newest</SelectItem>
                      <SelectItem value="top">Top Scored</SelectItem>
                      <SelectItem value="comments">Most Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts.map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between p-6 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                        >
                          r/{post.subreddit}
                        </Badge>
                        <span>
                          {new Date(
                            post.created_utc * 1000,
                          ).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.score} score
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.num_comments} comments
                        </span>
                      </div>
                      {post.selftext && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {post.selftext}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(`t3_${post.id}`, 1)}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(`t3_${post.id}`, -1)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://reddit.com${post.permalink}`,
                            "_blank",
                          )
                        }
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(`t3_${post.id}`)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Post Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-orange-600" />
                    Create New Post
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {userData?.reddit_connected
                      ? "Create and publish a new post to Reddit"
                      : "Connect Reddit account to create and publish posts"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Post Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter your post title..."
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="subreddit">Subreddit</Label>
                    <Input
                      id="subreddit"
                      placeholder="e.g., AskReddit, programming, funny"
                      value={newPost.subreddit}
                      onChange={(e) =>
                        setNewPost({ ...newPost, subreddit: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your post content here..."
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      rows={8}
                    />
                  </div>
                  <Button
                    onClick={
                      userData?.reddit_connected
                        ? handleCreatePost
                        : () => {
                            toast({
                              title: "Reddit Connection Required",
                              description:
                                "Please connect your Reddit account to create posts.",
                              variant: "destructive",
                            });
                          }
                    }
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={!userData?.reddit_connected}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {userData?.reddit_connected
                      ? "Submit Post"
                      : "Connect Reddit to Post"}
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <AISubredditSuggestions userData={userData} user={user} />
              <AIContentOptimizer userData={userData} user={user} />
            </div>
          </div>
        </TabsContent>

        {/* Subreddits Tab */}
        <TabsContent value="subreddits" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-yellow-600" />
                My Subreddits ({redditData.subreddits.length})
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {userData?.reddit_connected
                  ? "Subreddits you're subscribed to"
                  : "Demo subreddits - Connect Reddit for your subscriptions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {redditData.subreddits.map((subreddit: any) => (
                  <div
                    key={subreddit.data.id}
                    className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        r/{subreddit.data.display_name}
                      </h4>
                      <Badge variant="secondary">
                        {subreddit.data.subscribers?.toLocaleString() || "N/A"}{" "}
                        members
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {subreddit.data.public_description ||
                        subreddit.data.title}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://reddit.com/r/${subreddit.data.display_name}`,
                          "_blank",
                        )
                      }
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Subreddit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-pink-600" />
                    Inbox ({redditData.messages.length})
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {userData?.reddit_connected
                      ? "Your Reddit messages and notifications"
                      : "Demo messages - Connect Reddit for your actual inbox"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {redditData.messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          message.new
                            ? "border-orange-200 bg-orange-50 dark:bg-orange-950/30"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {message.subject}
                            </h4>
                            {message.new && (
                              <Badge
                                variant="default"
                                className="bg-orange-600"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              message.created_utc * 1000,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          From: u/{message.author}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3">
                          {message.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <Send className="w-5 h-5 mr-2 text-blue-600" />
                    Send Message
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Send a private message to another Reddit user
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="to">To (username)</Label>
                    <Input
                      id="to"
                      placeholder="Enter username..."
                      value={newMessage.to}
                      onChange={(e) =>
                        setNewMessage({ ...newMessage, to: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Message subject..."
                      value={newMessage.subject}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          subject: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="text">Message</Label>
                    <Textarea
                      id="text"
                      placeholder="Write your message..."
                      value={newMessage.text}
                      onChange={(e) =>
                        setNewMessage({ ...newMessage, text: e.target.value })
                      }
                      rows={6}
                    />
                  </div>
                  <Button
                    onClick={
                      userData?.reddit_connected
                        ? handleSendMessage
                        : () => {
                            toast({
                              title: "Reddit Connection Required",
                              description:
                                "Please connect your Reddit account to send messages.",
                              variant: "destructive",
                            });
                          }
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!userData?.reddit_connected}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {userData?.reddit_connected
                      ? "Send Message"
                      : "Connect Reddit to Send"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RedditConnectionCard />
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Reddit Account Info
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Your Reddit account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium">Username</span>
                    <span className="text-sm">
                      u/{redditData.userInfo?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium">Account Created</span>
                    <span className="text-sm">
                      {redditData.userInfo?.created_utc
                        ? new Date(
                            redditData.userInfo.created_utc * 1000,
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium">Total Karma</span>
                    <span className="text-sm font-bold text-orange-600">
                      {redditData.userInfo?.total_karma?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium">Gold Status</span>
                    <Badge
                      variant={
                        redditData.userInfo?.is_gold ? "default" : "secondary"
                      }
                    >
                      {redditData.userInfo?.is_gold ? "Premium" : "Regular"}
                    </Badge>
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
