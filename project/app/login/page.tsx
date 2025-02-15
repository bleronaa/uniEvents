"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import {toast} from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuth();
    const [loading, setLoading] = useState(false);
  
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setLoading(true);
  
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
  
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Login failed");
        }
  
        setAuth(data.token, data.user);
        toast.success("Logged in successfully");
        router.push("/");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Login failed");
      } finally {
        setLoading(false);
      }
    }
  
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }