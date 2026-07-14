import { useState } from "react";
import { ArrowLeft, Moon, Sun, Lock, Mail, User, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme-context";
import { BACKEND_URL } from "@/lib/config";

type AuthMode = "signin" | "signup";

export const AuthPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.email || !form.password || (mode === "signup" && !form.username)) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/signup" : "/signin";
      const payload =
        mode === "signup"
          ? { username: form.username, email: form.email, password: form.password }
          : { email: form.email, password: form.password };

      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload);

      if (mode === "signup") {
        toast.success("Account created. You can sign in now.");
        setMode("signin");
        setForm((prev) => ({ ...prev, username: "" }));
      } else {
        const token = response.data?.token;
        if (!token) {
          throw new Error("No token received from server.");
        }

        localStorage.setItem("authToken", token);
        toast.success("Signed in successfully.");
        navigate("/information");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Authentication failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-card transition-colors duration-300">
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Go back home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="relative z-10 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-border/50 bg-card/90 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30">
              AI
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to continue your interview prep."
                : "Sign up to start preparing with AI-powered interviews."}
            </p>
          </div>

          <div className="relative mb-6 flex rounded-full border border-border/60 bg-background/70 p-1">
            <div
              className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-primary shadow transition-transform duration-300 ease-out"
              style={{ transform: mode === "signin" ? "translateX(0%)" : "translateX(calc(100% + 8px))" }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                mode === "signin" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                mode === "signup" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(event) => handleChange("username", event.target.value)}
                  className="h-11 pl-10 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="h-11 pl-10 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(event) => handleChange("password", event.target.value)}
                className="h-11 pl-10 pr-10 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="h-11 w-full font-medium" disabled={loading}>

              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </span>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};