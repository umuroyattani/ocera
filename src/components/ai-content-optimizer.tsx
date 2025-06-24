"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Loader2,
  Sparkles,
  Send,
  Copy,
  Check,
  Wand2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface AIContentOptimizerProps {
  userData?: any;
  user?: any;
}

export default function AIContentOptimizer({
  userData,
  user,
}: AIContentOptimizerProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [tone, setTone] = useState("professional");
  const [optimizedContent, setOptimizedContent] = useState("");
  const [optimizedTitle, setOptimizedTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [optimizationTips, setOptimizationTips] = useState<string[]>([]);
  const [usageCount, setUsageCount] = useState(0);

  const supabase = createClient();

  // Check if user has premium plan
  const isPremium = userData?.subscription_plan === "premium";
  const monthlyLimit = 3;
  const hasReachedLimit = !isPremium && usageCount >= monthlyLimit;

  const handleOptimize = async () => {
    if (!content.trim()) {
      setError("Please enter some content to optimize");
      return;
    }

    // Check usage limits for free users
    if (!isPremium && usageCount >= monthlyLimit) {
      setError(
        `You've reached your monthly limit of ${monthlyLimit} AI optimizations. Upgrade to Premium for unlimited access.`,
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setOptimizationTips([]);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        "supabase-functions-ai-optimize-content",
        {
          body: {
            content: content.trim(),
            subreddit: subreddit.trim() || "general",
            tone,
          },
        },
      );

      if (functionError) {
        throw functionError;
      }

      if (data?.optimizedContent) {
        setOptimizedContent(data.optimizedContent);
        setOptimizedTitle(data.optimizedTitle || title);
        setOptimizationTips(
          data.tips || [
            "Content optimized for better engagement",
            "Tone adjusted for target audience",
            "Structure improved for readability",
          ],
        );
        setSuccess("Content optimized successfully!");
        // Increment usage count for free users
        if (!isPremium) {
          setUsageCount((prev) => prev + 1);
        }
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("No optimized content received");
      }
    } catch (err) {
      console.error("Error optimizing content:", err);
      let errorMsg = "Failed to optimize content. Please try again.";

      if (err && typeof err === "object") {
        if ("message" in err) {
          errorMsg = (err as any).message;
        } else if ("details" in err) {
          errorMsg = `Error: ${(err as any).details}`;
        }
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostToReddit = async () => {
    if (!optimizedContent.trim() || !subreddit.trim()) {
      setError("Please optimize content and specify a subreddit first");
      return;
    }

    setIsPosting(true);
    setError("");

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        "supabase-functions-reddit-post",
        {
          body: {
            title: optimizedTitle || title || "Untitled Post",
            content: optimizedContent,
            subreddit: subreddit.replace(/^r\//, ""), // Remove r/ prefix if present
          },
        },
      );

      if (functionError) {
        throw functionError;
      }

      if (data?.success) {
        setSuccess(`Post successfully submitted to r/${subreddit}!`);
        // Clear form after successful post
        setContent("");
        setTitle("");
        setOptimizedContent("");
        setOptimizedTitle("");
        setOptimizationTips([]);
        setTimeout(() => setSuccess(""), 5000);
      } else {
        throw new Error(data?.error || "Failed to post to Reddit");
      }
    } catch (err) {
      console.error("Error posting to Reddit:", err);
      let errorMsg = "Failed to post to Reddit. Please try again.";

      if (err && typeof err === "object") {
        if ("message" in err) {
          errorMsg = (err as any).message;
        } else if ("details" in err) {
          errorMsg = `Error: ${(err as any).details}`;
        }
      }

      setError(errorMsg);
    } finally {
      setIsPosting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const resetForm = () => {
    setContent("");
    setTitle("");
    setOptimizedContent("");
    setOptimizedTitle("");
    setOptimizationTips([]);
    setError("");
    setSuccess("");
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-950">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-950/20 dark:to-purple-950/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-lg">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Content Optimizer
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                  Transform your content for maximum Reddit engagement
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-orange-500 to-purple-500 text-white border-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Post Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter your post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="content"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Your Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Enter your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="resize-none border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="subreddit"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Target Subreddit
                </Label>
                <Input
                  id="subreddit"
                  placeholder="e.g., programming, entrepreneur"
                  value={subreddit}
                  onChange={(e) => setSubreddit(e.target.value)}
                  className="border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tone"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Content Tone
                </Label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-background px-3 py-2 text-sm focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="technical">Technical</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Pro Tips:</p>
                    <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                      <li>
                        • Be specific about your target subreddit for better
                        optimization
                      </li>
                      <li>• Choose a tone that matches your audience</li>
                      <li>
                        • Longer content gets better AI optimization results
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {!isPremium && (
                <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-950/30 dark:to-purple-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-800 dark:text-orange-200">
                      <p className="font-medium mb-1">Usage Limit:</p>
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        {usageCount}/{monthlyLimit} AI optimizations used this
                        month.
                        {hasReachedLimit
                          ? " Upgrade to Premium for unlimited access!"
                          : " Upgrade for unlimited optimizations."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleOptimize}
              disabled={isLoading || !content.trim() || hasReachedLimit}
              className={`${hasReachedLimit ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700"} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 min-w-[200px]`}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Optimizing with AI...
                </>
              ) : hasReachedLimit ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Limit Reached - Upgrade
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Optimize Content{" "}
                  {!isPremium ? `(${monthlyLimit - usageCount} left)` : ""}
                </>
              )}
            </Button>

            {optimizedContent && (
              <Button
                onClick={handlePostToReddit}
                disabled={isPosting || !subreddit.trim()}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post to Reddit
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={resetForm}
              variant="outline"
              size="lg"
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {optimizedContent && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Optimized Content
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                    AI-enhanced version ready for posting
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(`${optimizedTitle}\n\n${optimizedContent}`)
                }
                className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy All
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {optimizationTips.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Optimization Applied:
                </h4>
                <ul className="space-y-1">
                  {optimizationTips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2"
                    >
                      <Check className="w-3 h-3 text-green-600" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {optimizedTitle && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Optimized Title:
                </Label>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    {optimizedTitle}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Optimized Content:
              </Label>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
                  {optimizedContent}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(optimizedContent)}
                size="sm"
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Content
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setContent(optimizedContent);
                  setTitle(optimizedTitle || title);
                }}
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Use This Version
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOptimizedContent("");
                  setOptimizedTitle("");
                  setOptimizationTips([]);
                }}
                size="sm"
                className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
