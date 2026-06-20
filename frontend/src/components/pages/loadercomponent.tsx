import { LoaderIcon, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export function SpinnerCustom() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-card">
      <div className="flex flex-col items-center gap-8">
        {/* Main Loader Container */}
        <div className="relative w-32 h-32">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin"></div>
          
          {/* Middle rotating circle (opposite direction) */}
          <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-accent border-l-accent/50 animate-spin-reverse"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Analyzing your GitHub
          </h2>
          <p className="text-muted-foreground">
            <span className="inline-block">
              Building your personalized interview
              <span className="inline-flex gap-1 ml-1">
                <span className="animate-bounce" style={{ animationDelay: "0s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </span>
            </span>
          </p>
        </div>

        {/* Progress indicators */}
        <div className="space-y-3 w-full max-w-xs">
          {[
            { label: "Fetching repositories", delay: "0s" },
            { label: "Analyzing code quality", delay: "0.3s" },
            { label: "Generating questions", delay: "0.6s" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/30"
              style={{ animation: `fadeIn 0.5s ease-out ${item.delay}` }}
            >
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom hint */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            This may take a few moments. We're preparing something great! ✨
          </p>
        </div>
      </div>
    </div>
  )
}
