"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CooldownTimerProps {
  endTime: Date
  onComplete?: () => void
  className?: string
}

export function CooldownTimer({ endTime, onComplete, className = "" }: CooldownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now
      
      if (distance <= 0) {
        setTimeLeft(0)
        setIsComplete(true)
        onComplete?.()
        return
      }
      
      setTimeLeft(distance)
      setIsComplete(false)
    }

    // Update immediately
    updateTimer()

    // Then update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [endTime, onComplete])

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  if (isComplete) {
    return (
      <Badge variant="default" className={`bg-green-500 ${className}`}>
        <Clock className="w-3 h-3 mr-1" />
        Available Now
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className={`bg-orange-100 text-orange-800 ${className}`}>
      <Clock className="w-3 h-3 mr-1" />
      {formatTime(timeLeft)}
    </Badge>
  )
} 