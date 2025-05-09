"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { StationMonthlyRainfall } from "@/lib/models"
import { RainfallSparkline } from "./rainfall-sparkline"

interface RainfallTableProps {
  data: StationMonthlyRainfall
  isLoading: boolean
}

export function RainfallTable({ data, isLoading }: RainfallTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }
  
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {monthNames.map((month) => (
                <TableHead key={month} className="text-center">
                  {month}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <RainfallSparkline months={data.months} />
          </TableRow>        
        </TableBody>
      </Table>
    </div>
  )
}
