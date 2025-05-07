"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface RainfallData {
  id: number
  date_measured: string
  climate_scenario: string
  station: string
  rainfall_total: number
  month_name: string
}

interface RainfallChartProps {
  data: RainfallData[]
  isLoading: boolean
}

export function RainfallChart({ data, isLoading }: RainfallChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Find the maximum rainfall value for scaling
  const maxRainfall = Math.max(...data.map((item) => item.rainfall_total), 0)

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-full items-end gap-2">
        {data.map((item) => {
          // Calculate the height percentage based on the maximum value
          const heightPercentage = maxRainfall > 0 ? (item.rainfall_total / maxRainfall) * 100 : 0

          return (
            <div key={item.id} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-emerald-500 transition-all duration-500 ease-in-out"
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <div className="text-xs font-medium">{item.month_name}</div>
            </div>
          )
        })}
      </div>
      {data.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  )
}
