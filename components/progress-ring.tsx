"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  color?: "orange" | "green" | "blue" | "purple"
  animated?: boolean
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showPercentage = true,
  color = "orange",
  animated = true
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  const colorMap = {
    orange: {
      bg: "stroke-orange-200",
      fill: "stroke-orange-500",
      text: "text-orange-600"
    },
    green: {
      bg: "stroke-green-200", 
      fill: "stroke-green-500",
      text: "text-green-600"
    },
    blue: {
      bg: "stroke-blue-200",
      fill: "stroke-blue-500", 
      text: "text-blue-600"
    },
    purple: {
      bg: "stroke-purple-200",
      fill: "stroke-purple-500",
      text: "text-purple-600"
    }
  }

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedProgress(progress)
    }
  }, [progress, animated])

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          className={colorMap[color].bg}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          className={colorMap[color].fill}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeInOut" }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={cn("text-center", colorMap[color].text)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animated ? 0.5 : 0, duration: 0.3 }}
          >
            <div className="text-2xl font-bold">
              {Math.round(animatedProgress)}%
            </div>
            <div className="text-xs opacity-70">Complete</div>
          </motion.div>
        </div>
      )}
    </div>
  )
}