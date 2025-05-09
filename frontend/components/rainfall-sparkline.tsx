"use client"

import { TableCell } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { MonthlyRainfall } from "@/lib/models"

interface RainfallSparklineProps {
  months: MonthlyRainfall
}

export function RainfallSparkline({ months }: RainfallSparklineProps) {
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const values = monthNames.map((month) => Number.parseFloat(months[month]))
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min

  // Calculate average
  const average = values.reduce((sum, val) => sum + val, 0) / values.length

  return (
    <TableCell>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <div className="flex items-end h-10 gap-0.5">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="w-2 bg-orange-500 rounded-t"
                  style={{
                    height: `${((value - min) / (range || 1)) * 100}%`,
                    minHeight: "2px",
                  }}
                />
              ))}
            </div>
            <div className="text-xs text-center mt-1">Avg: {average.toFixed(1)}°C</div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="grid grid-cols-3 gap-2 p-2">
              {monthNames.map((month, index) => (
                <div key={month} className="flex justify-between gap-2">
                  <span className="font-medium">{month}:</span>
                  <span>{values[index].toFixed(1)}°C</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  )
}
