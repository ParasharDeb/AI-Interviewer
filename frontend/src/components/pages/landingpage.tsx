import { ArrowRight, Github, Zap, Brain, Target, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Landingpage = () => {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold">
              AI
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">InterviewAI</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">Docs</button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">Features</button>
            <Button size="sm" onClick={() => navigate("/information")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Main Heading with Animation */}
          <div
            className={`space-y-4 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Interviews</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold leading-tight">
              <span className="text-foreground">Master</span>{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                Technical Interviews
              </span>
              <br />
              <span className="text-muted-foreground text-4xl sm:text-5xl">with AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get personalized interview prep powered by your GitHub. Real-time feedback, adaptive difficulty, and interview-style questions tailored to your skills.
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Button size="lg" className="gap-2 text-base h-12" onClick={() => navigate("/interview")}>
              Start Free <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-base h-12" onClick={() => navigate("/interview")}>
              <Github className="w-4 h-4" /> Connect GitHub
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-8 animate-bounce">
            <ChevronDown className="w-6 h-6 text-muted-foreground mx-auto" />
          </div>
        </div>

        {/* Hero Image / Showcase */}
        <div
          className={`mt-20 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl"></div>
            <div className="relative bg-card border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Brain, label: "AI Analysis", desc: "GitHub analysis" },
                  { icon: Target, label: "Personalized", desc: "Tailored questions" },
                  { icon: Zap, label: "Real-time", desc: "Live feedback" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group p-4 rounded-lg hover:bg-primary/5 transition-all duration-300 hover:scale-105"
                  >
                    <item.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Four simple steps to ace your interview
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Connect GitHub",
                description: "Link your GitHub account and we'll analyze your projects, languages, and expertise.",
                icon: Github,
              },
              {
                step: "02",
                title: "Get Insights",
                description: "Our AI reviews your code quality, project complexity, and technical depth.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Custom Questions",
                description: "Receive interview questions tailored to your skill level and experience.",
                icon: Target,
              },
              {
                step: "04",
                title: "Real-time Feedback",
                description: "Get instant feedback on your answers with suggestions for improvement.",
                icon: Zap,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-xl border border-border/50 hover:border-primary/50 bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                  {item.step}
                </div>

                {/* Icon */}
                <item.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>

                {/* Line */}
                {index < 3 && (
                  <div className="absolute -bottom-8 left-8 w-1 h-8 bg-gradient-to-b from-primary/50 to-transparent hidden md:block lg:hidden xl:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features List */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Powerful Features
                </h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need to prepare for your dream job
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Real-time code analysis from your GitHub",
                  "Adaptive difficulty based on your level",
                  "Instant AI-powered feedback and hints",
                  "Track your progress and improvement",
                  "Practice with unlimited questions",
                  "Interview simulation mode",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative h-96 hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-2xl"></div>
              <div className="relative h-full bg-card border border-border/50 rounded-2xl p-8 space-y-4 overflow-hidden">
                {/* Animated Terminal-like Display */}
                <div className="space-y-2">
                  <div className="h-2 bg-primary/30 rounded w-3/4 animate-pulse"></div>
                  <div className="h-2 bg-primary/20 rounded w-1/2 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-2 bg-primary/30 rounded w-2/3 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
                <div className="pt-4 border-t border-border/30 space-y-2">
                  <div className="h-2 bg-accent/30 rounded w-4/5 animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                  <div className="h-2 bg-accent/20 rounded w-3/5 animate-pulse" style={{ animationDelay: "0.8s" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { number: "10K+", label: "Users Prepared" },
                { number: "95%", label: "Success Rate" },
                { number: "50ms", label: "Average Response" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Ready to ace your interview?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers preparing for their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 text-base gap-2" onClick={() => navigate("/interview")}>
              Start Now <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 text-base" onClick={() => navigate("/interview")}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card/50 backdrop-blur py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-lg mb-4">InterviewAI</div>
              <p className="text-sm text-muted-foreground">
                AI-powered interview prep tailored to your GitHub profile
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "FAQ"] },
              { title: "Company", links: ["About", "Blog", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 InterviewAI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
