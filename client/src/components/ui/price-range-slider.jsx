import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export function PriceRangeSlider({ min, max, value, onValueChange }) {
  return (
    <SliderPrimitive.Root
      className="relative flex w-full touch-none select-none items-center"
      value={value}
      max={max}
      min={min}
      step={1}
      onValueChange={onValueChange}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
        <SliderPrimitive.Range className="absolute h-full bg-[#8CC63F]" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-4 w-4 rounded-full border border-[#8CC63F] bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
      <SliderPrimitive.Thumb
        className="block h-4 w-4 rounded-full border border-[#8CC63F] bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  )
}

