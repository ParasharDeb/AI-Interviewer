import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { toast } from "sonner";
import { SpinnerCustom } from "./loadercomponent";
export const Interviewpage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [github,setgithub]=useState<string>("")
  const [loading, setLoading] = useState(false);
  
  async function submitgithuburl(){
    if (!github || github.trim() === "") {
      toast.error("GitHub URL is required", {
        description: "Please enter a valid GitHub URL to continue.",
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/github-verification`, {
        githuburl: github  // Changed from githubUrl to githuburl
      });
      toast.success("GitHub profile loaded!", {
        description: "Starting your personalized interview...",
      });
      console.log(response);
      navigate("/loading-content")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error("Error loading GitHub profile", {
        description: errorMessage || "Please check your GitHub URL and try again.",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {loading && <SpinnerCustom />}
      {!loading && (
    <div className="min-h-screen bg-gradient-to-br from-background to-card transition-colors duration-300">
      {/* Header with Theme Toggle */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors duration-200 text-foreground"
              aria-label="Go back home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              AI
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Interviewer
            </h1>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent/10 transition-colors duration-200 text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-8 space-y-8">
            {/* Greeting Section */}
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground text-sm uppercase tracking-wide font-medium">
                Welcome
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                Get Started
              </h2>
              <p className="text-muted-foreground text-sm">
                Enter your GitHub URL to begin your AI-powered technical interview
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <Field>
                <FieldLabel htmlFor="input-field-username" className="text-base font-semibold">
                  GitHub URL
                </FieldLabel>
                <Input
                  id="input-field-username"
                  type="text"
                  placeholder="https://github.com/yourprofile"
                  className="h-11 text-base rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  value={github}
                  onChange={(e) => setgithub(e.target.value)}
                />
                <FieldDescription className="text-xs text-muted-foreground">
                  We'll analyze your GitHub profile to personalize your interview experience.
                </FieldDescription>
              </Field>

              {/* Submit Button */}
              <Button
                className="w-full h-11 text-base font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                size="lg"
                onClick={submitgithuburl}
                disabled={loading}
              >
                {loading ? "Loading..." : "Start Interview"}
              </Button>
            </div>

            {/* Footer Note */}
            <div className="border-t border-border/30 pt-6">
              <p className="text-xs text-muted-foreground text-center">
                Your data is secure and will only be used for this interview session.
              </p>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="mt-8 flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
            <div className="w-2 h-2 rounded-full bg-primary/50"></div>
            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
          </div>
        </div>
      </main>
    </div>
      )}
    </>
  )
}