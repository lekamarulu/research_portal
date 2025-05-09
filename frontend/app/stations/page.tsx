"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, MapPin } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Station } from "@/lib/models"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { researchPortalApi } from "@/lib/api"

export default function StationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [stationData, setStationData] = useState<Station[]>([])
  
  const [error, setError] = useState<string | null>(null)
    const router = useRouter()
  
    useEffect(() => {
      // Fetch data from API
      const fetchData = async () => {
        setIsLoading(true)
        try {
          setError(null)
  
          const stationResult = await researchPortalApi.getStations()
          setStationData(stationResult)
  
        } catch (error) {
          console.error("Error fetching data:", error)
          setError(error instanceof Error ? error.message : "Failed to fetch data")
  
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchData()
    }, [])

  const filteredStations = stationData.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  

  return (
    <div className="container space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stations</h1>
          <p className="text-muted-foreground">View and manage rainfall monitoring stations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Station
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Station</DialogTitle>
              <DialogDescription>Enter the details for the new monitoring station</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input id="code" placeholder="ST004" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Station Name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="latitude" className="text-right">
                  Latitude
                </Label>
                <Input id="latitude" type="number" step="0.000001" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="longitude" className="text-right">
                  Longitude
                </Label>
                <Input id="longitude" type="number" step="0.000001" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="river" className="text-right">
                  River
                </Label>
                <Input id="river" placeholder="River name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="basin" className="text-right">
                  Basin
                </Label>
                <Input id="basin" placeholder="Basin name" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Station</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring Stations</CardTitle>
          <CardDescription>List of all rainfall monitoring stations in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Established</TableHead>
                    <TableHead>River</TableHead>
                    <TableHead>Basin</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>

                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No stations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStations.map((station) => (
                      <TableRow key={station.code}>
                        <TableCell className="font-medium">{station.code}</TableCell>
                        <TableCell>{station.name}</TableCell>
                         <TableCell>{station.station_type}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              station.status === "Operational"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {station.status}
                          </span>
                        </TableCell>
                        <TableCell>{station.date_established}</TableCell>
                        <TableCell>{station.river}</TableCell>
                        <TableCell>{station.basin}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">
                              {station.latitude.toFixed(2)}, {station.longitude.toFixed(2)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
