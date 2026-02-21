import * as React from "react"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  days: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeStyles = {
  sm: {
    icon: 16,
    text: 'text-sm',
    padding: 'p-1'
  },
  md: {
    icon: 20,
    text: 'text-base',
    padding: 'p-2'
  },
  lg: {
    icon: 24,
    text: 'text-lg',
    padding: 'p-3'
  }
}

export const StreakCounter = React.forwardRef<HTMLDivElement, StreakCounterProps>(
  ({ className, days, size = 'md', showLabel = true, ...props }, ref) => {
    const styles = sizeStyles[size]
    const hasStreak = days > 0

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full",
          hasStreak 
            ? "bg-gradient-to-r from-orange-400 to-red-500 text-white" 
            : "bg-gray-100 text-gray-500",
          styles.padding,
          className
        )}
        {...props}
      >
        <Flame 
          size={styles.icon} 
          className={cn(
            "transition-all",
            hasStreak && "animate-pulse"
          )} 
        />
        <span className={cn("font-bold", styles.text)}>
          {days}
        </span>
        {showLabel && (
          <span className={cn("ml-1", styles.text)}>
            {days === 1 ? 'dia' : 'dias'}
          </span>
        )}
      </div>
    )
  }
)

StreakCounter.displayName = "StreakCounter"