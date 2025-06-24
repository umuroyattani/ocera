"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  Crown,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Clock,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  user?: any;
}

export default function PaywallModal({
  isOpen,
  onClose,
  feature,
  user,
}: PaywallModalProps) {
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const supabase = createClient();

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

  const premiumFeatures = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: "Unlimited AI Optimizations",
      description: "No monthly limits on content optimization",
    },
    {
      icon: <Target className="w-4 h-4" />,
      title: "Unlimited Subreddit Suggestions",
      description: "Find perfect communities without restrictions",
    },
    {
      icon: <Clock className="w-4 h-4" />,
      title: "Smart Post Scheduling",
      description: "Automatically post at optimal times",
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      title: "Advanced Analytics",
      description: "Detailed insights and performance tracking",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Priority Support",
      description: "Get help when you need it most",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Upgrade to Premium
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            You've reached your monthly limit for {feature}. Upgrade to Premium
            for unlimited access to all features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                $10
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mt-2">
                <Crown className="w-3 h-3 mr-1" />
                Premium Plan
              </Badge>
            </div>

            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-purple-600 dark:text-purple-400 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 dark:border-gray-600"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              {upgradeLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
