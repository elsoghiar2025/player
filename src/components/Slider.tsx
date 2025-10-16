"use client"

import * as React from "react"
import { cn } from "../lib/utils"

interface SliderProps {
  value: number[]
  max: number
  step: number
  onValueChange: (value: number[]) => void
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(({ value, max, step, onValueChange, className }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([Number(e.target.value)])
  }

  return (
    <div ref={ref} className={cn("relative flex items-center w-full", className)}>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, white ${value[0]}%, rgba(0,0,0,0.6) ${value[0]}%)`,
        }}
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }
