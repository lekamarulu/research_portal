"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface RainfallData {
  id: number
  date_measured: string
  climate_scenario: string
  station: string
  rainfall_total: number
  month_name: string
}

interface RainfallTableProps {
  data: RainfallData[]
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Scenario</TableHead>
            <TableHead className="text-right">Rainfall (mm)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date_measured}</TableCell>
                <TableCell>{item.month_name}</TableCell>
                <TableCell>{item.station}</TableCell>
                <TableCell>{item.climate_scenario}</TableCell>
                <TableCell className="text-right">{item.rainfall_total.toFixed(1)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
