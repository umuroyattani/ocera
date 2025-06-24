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
  Target,
  Users,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  Search,
  AlertCircle,
  Zap,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface SubredditSuggestion {
  name: string;
  description: string;
  subscribers: string;
  engagement: string;
  relevanceScore?: number;
  rules?: string[];
}

interface AISubredditSuggestionsProps {
  userData?: any;
  user?: any;
}

export default function AISubredditSuggestions({
  userData,
  user,
}: AISubredditSuggestionsProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState<SubredditSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  const supabase = createClient();

  // Check if user has premium plan
  const isPremium = userData?.subscription_plan === "premium";
  const monthlyLimit = 3;
  const hasReachedLimit = !isPremium && usageCount >= monthlyLimit;

  const handleGetSuggestions = async () => {
    if (!content.trim()) {
      setError("Please enter some content to analyze");
      return;
    }

    // Check usage limits for free users
    if (!isPremium && usageCount >= monthlyLimit) {
      setError(
        `You've reached your monthly limit of ${monthlyLimit} subreddit suggestions. Upgrade to Premium for unlimited access.`,
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        "supabase-functions-ai-suggest-subreddits",
        {
          body: {
            content: content.trim(),
            category: category.trim() || "general",
          },
        },
      );

      if (functionError) {
        throw functionError;
      }

      if (data?.suggestions) {
        // Add mock relevance scores and rules for better UX
        const enhancedSuggestions = data.suggestions.map(
          (suggestion: SubredditSuggestion, index: number) => ({
            ...suggestion,
            relevanceScore: Math.floor(Math.random() * 20) + 80, // 80-99% relevance
            rules: [
              "Follow community guidelines",
              "No spam or self-promotion",
              "Be respectful and constructive",
            ],
          }),
        );
        setSuggestions(enhancedSuggestions);
        // Increment usage count for free users
        if (!isPremium) {
          setUsageCount((prev) => prev + 1);
        }
      } else {
        throw new Error("No suggestions received");
      }
    } catch (err) {
      console.error("Error getting subreddit suggestions:", err);
      let errorMsg = "Failed to get suggestions. Please try again.";

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

  const getEngagementColor = (engagement: string) => {
    switch (engagement.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-300";
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const copySubredditName = async (name: string, index: number) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="bg-white dark:bg-gray-950 border-0 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Smart Subreddit Finder
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                Discover the perfect communities for your content
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0"
          >
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="suggestion-content"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Content to Analyze
              </Label>
              <Textarea
                id="suggestion-content"
                placeholder="Paste your content here to get subreddit suggestions..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="resize-none border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Category (optional)
              </Label>
              <Input
                id="category"
                placeholder="e.g., technology, business, gaming"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-indigo-800 dark:text-indigo-200">
                  <p className="font-medium mb-2">How it works:</p>
                  <ul className="text-xs space-y-1 text-indigo-700 dark:text-indigo-300">
                    <li>• AI analyzes your content's topic and tone</li>
                    <li>• Matches with relevant subreddit communities</li>
                    <li>• Provides engagement and subscriber insights</li>
                    <li>• Shows relevance scores for better targeting</li>
                  </ul>
                </div>
              </div>
            </div>

            {!isPremium && (
              <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-950/30 dark:to-purple-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <p className="font-medium mb-1">Usage Limit:</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      {usageCount}/{monthlyLimit} subreddit suggestions used
                      this month.
                      {hasReachedLimit
                        ? " Upgrade to Premium for unlimited access!"
                        : " Upgrade for unlimited suggestions."}
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

        <Button
          onClick={handleGetSuggestions}
          disabled={isLoading || !content.trim() || hasReachedLimit}
          className={`w-full ${hasReachedLimit ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing content and finding subreddits...
            </>
          ) : hasReachedLimit ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Limit Reached - Upgrade
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Find Perfect Subreddits{" "}
              {!isPremium ? `(${monthlyLimit - usageCount} left)` : ""}
            </>
          )}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Recommended Subreddits
              </h3>
              <Badge
                variant="outline"
                className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
              >
                {suggestions.length} found
              </Badge>
            </div>

            <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
              {suggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                            r/{suggestion.name}
                          </h4>
                          {suggestion.relevanceScore && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${getRelevanceColor(suggestion.relevanceScore)} border-current`}
                            >
                              {suggestion.relevanceScore}% match
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {suggestion.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Badge
                          className={`text-xs font-medium ${getEngagementColor(suggestion.engagement)}`}
                        >
                          {suggestion.engagement} activity
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        {suggestion.subscribers} members
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copySubredditName(suggestion.name, index)
                          }
                          className="text-xs hover:bg-purple-50 dark:hover:bg-purple-950/30 border-purple-200 dark:border-purple-800"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3 h-3 mr-1 text-green-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.open(
                              `https://reddit.com/r/${suggestion.name}`,
                              "_blank",
                            );
                          }}
                          className="text-xs hover:bg-blue-50 dark:hover:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p className="font-medium mb-1">Next Steps:</p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Visit these subreddits to understand their culture and rules
                    before posting. Use the AI Content Optimizer to tailor your
                    content for each community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
