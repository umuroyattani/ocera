"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Lock,
  Shield,
  Crown,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface AccountClientProps {
  user: any;
  userData: any;
}

export default function AccountClient({ user, userData }: AccountClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState(userData?.display_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to upgrade your plan",
        variant: "destructive",
      });
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
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data?.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const sendVerificationCode = async (action: string) => {
    try {
      // In a real app, you'd send an email/SMS with a verification code
      // For demo purposes, we'll simulate this
      setPendingAction(action);
      setTwoFactorDialogOpen(true);
      toast({
        title: "Verification Required",
        description: "A verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code.",
        variant: "destructive",
      });
    }
  };

  const verifyAndExecuteAction = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you'd verify the code with your backend
      // For demo purposes, we'll accept "123456" as valid
      if (verificationCode !== "123456") {
        throw new Error("Invalid verification code");
      }

      // Execute the pending action
      switch (pendingAction) {
        case "updateProfile":
          await updateProfile();
          break;
        case "updateEmail":
          await updateEmail();
          break;
        case "updatePassword":
          await updatePassword();
          break;
      }

      setTwoFactorDialogOpen(false);
      setVerificationCode("");
      setPendingAction(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Verification failed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ display_name: displayName })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      router.refresh();
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile");
    }
  };

  const updateEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;

      toast({
        title: "Success",
        description:
          "Email update initiated. Please check your new email for confirmation.",
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to update email");
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      throw new Error("New passwords do not match");
    }

    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      throw new Error(error.message || "Failed to update password");
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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your account preferences and security settings
                </p>
              </div>
            </div>
            {getPlanBadge()}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Subscription Plan
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Current Plan:{" "}
                      {userData?.subscription_plan === "premium"
                        ? "Premium"
                        : "Free"}
                    </h3>
                    {getPlanBadge()}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userData?.subscription_plan === "premium"
                      ? "Unlimited access to all features"
                      : "Limited access - upgrade for unlimited features"}
                  </p>
                </div>
                {userData?.subscription_plan !== "premium" && (
                  <Button
                    onClick={handleUpgrade}
                    disabled={upgradeLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                    {upgradeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>
              <Button
                onClick={() => sendVerificationCode("updateProfile")}
                disabled={
                  isLoading || displayName === (userData?.display_name || "")
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Change your email address (requires verification)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Changing your email will require verification at both your
                    current and new email addresses.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => sendVerificationCode("updateEmail")}
                disabled={isLoading || email === user?.email}
                className="bg-green-600 hover:bg-green-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Update Email
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Password & Security
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Password Requirements:</p>
                    <ul className="text-xs space-y-1">
                      <li>• At least 6 characters long</li>
                      <li>
                        • Mix of letters, numbers, and symbols recommended
                      </li>
                      <li>• Should be unique and not used elsewhere</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => sendVerificationCode("updatePassword")}
                disabled={
                  isLoading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="bg-red-600 hover:bg-red-700"
              >
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2FA Verification Dialog */}
      <Dialog open={twoFactorDialogOpen} onOpenChange={setTwoFactorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Two-Factor Verification
            </DialogTitle>
            <DialogDescription>
              For your security, please enter the 6-digit verification code sent
              to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                placeholder="Enter 6-digit code"
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                For demo purposes, use code:{" "}
                <span className="font-mono font-bold">123456</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setTwoFactorDialogOpen(false);
                  setVerificationCode("");
                  setPendingAction(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={verifyAndExecuteAction}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Verify & Update
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
