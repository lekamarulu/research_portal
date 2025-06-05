"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import 'leaflet/dist/leaflet.css'

type Station = {
  code: string
  name: string
  longitude: number
  latitude: number
  status: string
  subbasin_name: string
}

const stationsData: Station[] = [
  { code: "Biharamulo", name: "Biharamulo", longitude: 31.3, latitude: -2.63, status: "Operational", subbasin_name: "Kagera" },
  { code: "Bukoba", name: "Bukoba", longitude: 31.82, latitude: -1.33, status: "Operational", subbasin_name: "Kagera" },
  { code: "Igabiro", name: "Igabiro", longitude: 31.55, latitude: -1.8, status: "Operational", subbasin_name: "Kagera" },
  { code: "Izigo", name: "Izigo", longitude: 31.72, latitude: -1.62, status: "Operational", subbasin_name: "Kagera" },
  { code: "Kaisho", name: "Kaisho", longitude: 30.68, latitude: -1.25, status: "Operational", subbasin_name: "Kagera" },
  { code: "Kayanga", name: "Kayanga", longitude: 31.17, latitude: -1.53, status: "Operational", subbasin_name: "Kagera" },
  { code: "Kishanda", name: "Kishanda", longitude: 31.57, latitude: -1.7, status: "Operational", subbasin_name: "Kagera" },
  { code: "Kyakakera", name: "Kyakakera", longitude: 31.45, latitude: -1.3, status: "Operational", subbasin_name: "Kagera" },
  { code: "Ngara", name: "Ngara", longitude: 30.63, latitude: -2.47, status: "Operational", subbasin_name: "Kagera" },
  { code: "Rubya", name: "Rubya", longitude: 31.62, latitude: -1.72, status: "Operational", subbasin_name: "Kagera" },
  { code: "Rulenge", name: "Rulenge", longitude: 30.62, latitude: -2.73, status: "Operational", subbasin_name: "Kagera" },
]

const columns = [
  { key: "code", label: "Code", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "subbasin_name", label: "Subbasin", sortable: true },
  { key: "longitude", label: "Longitude", sortable: true },
  { key: "latitude", label: "Latitude", sortable: true },
  { key: "status", label: "Status", sortable: true },
]

const filters = [
  {
    key: "subbasin_name",
    label: "Subbasin",
    options: ["Kagera"],
  },
]

function StationMap() {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainer) return

    import("leaflet").then((L) => {
      mapContainer.innerHTML = ""

      const bounds = L.latLngBounds(
        stationsData.map((station: Station) => [station.latitude, station.longitude])
      )

      const map = L.map(mapContainer, {
        center: bounds.getCenter(),
        zoom: 9,
        zoomControl: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map)

      const stationIcon = L.divIcon({
        html: `<div style="
          background-color: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        className: "custom-station-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      stationsData.forEach((station: Station) => {
        const marker = L.marker([station.latitude, station.longitude], {
          icon: stationIcon,
          title: station.name,
        }).addTo(map)

        const popupContent = `
          <div style="min-width: 180px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${station.name}</h3>
            <p style="margin: 2px 0;"><strong>Code:</strong> ${station.code}</p>
            <p style="margin: 2px 0;"><strong>Status:</strong> ${station.status}</p>
            <p style="margin: 2px 0;"><strong>Coordinates:</strong> ${station.latitude.toFixed(3)}, ${station.longitude.toFixed(3)}</p>
            <p style="margin: 0; font-style: italic; font-size: 12px; color: #6b7280;">Subbasin: ${station.subbasin_name}</p>
          </div>
        `
        marker.bindPopup(popupContent, { maxWidth: 250, className: "custom-popup" })
      })

      map.fitBounds(bounds, { padding: [20, 20] })
      L.control.scale().addTo(map)

      return () => {
        map.remove()
      }
    })
  }, [mapContainer])

  return (
    <div className="space-y-4">
      <div
        ref={setMapContainer}
        className="h-96 w-full rounded-lg border border-gray-200"
        style={{ minHeight: "400px" }}
      />
      <div className="text-sm text-gray-600 mt-2">
        <p>🔵 Click on station markers to view detailed information</p>
        <p>📍 Hover over markers to see station names</p>
      </div>
    </div>
  )
}

export function StationsSetup() {
  const [activeTab, setActiveTab] = useState("table")

  const handleAdd = () => console.log("Add new station")
  const handleEdit = (item: any) => console.log("Edit station:", item)
  const handleDelete = (item: any) => console.log("Delete station:", item)
  const handleExport = (format: string) => console.log("Export stations data as:", format)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stations Setup</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="map">Station Map</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={stationsData}
            columns={columns}
            title="Multi-parameter Weather Stations"
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExport}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-parameter Station Locations</CardTitle>
              <p className="text-sm text-gray-600">
                Interactive map showing multi-parameter meteorological stations across the Kagera Basin using OpenStreetMap.
              </p>
            </CardHeader>
            <CardContent>
              <StationMap />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
