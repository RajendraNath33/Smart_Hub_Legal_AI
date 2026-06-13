"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
      toast({ title: "Email Sent", description: "Check your inbox for password reset instructions." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <Card className="border-none shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-full mb-4">
              <KeyRound className="h-6 w-6 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              We'll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>
          {isSubmitted ? (
            <CardContent className="space-y-4 text-center">
              <div className="p-4 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-100">
                A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Back to Login</Link>
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleReset}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="lawyer@firm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Send Reset Link"}
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/login" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                  </Link>
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}