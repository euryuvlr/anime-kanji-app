import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  labelPosition?: 'top' | 'right' | 'bottom'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  default: 'bg-primary-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500'
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2.5',
  lg: 'h-4'
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    showLabel = false,
    labelPosition = 'top',
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const label = showLabel ? (
      <span className="text-sm font-medium text-gray-700">
        {Math.round(percentage)}%
      </span>
    ) : null

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {labelPosition === 'top' && label && (
          <div className="mb-1 flex justify-between">
            {label}
          </div>
        )}
        
        <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizeStyles[size])}>
          <div
            className={cn(
              "transition-all duration-300 ease-in-out rounded-full",
              variantStyles[variant],
              sizeStyles[size]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {labelPosition === 'bottom' && label && (
          <div className="mt-1 flex justify-center">
            {label}
          </div>
        )}
      </div>
    )
  }
)

ProgressBar.displayName = "ProgressBar"