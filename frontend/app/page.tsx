"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Dashboard } from "@/components/dashboard"
import { RainfallDetail } from "@/components/rainfall/rainfall-detail"
import { RainfallPivotDaily } from "@/components/rainfall/rainfall-pivot-daily"
import { RainfallPivotMonthly } from "@/components/rainfall/rainfall-pivot-monthly"
import { TemperatureDetail } from "@/components/temperature/temperature-detail"
import { TemperaturePivotDaily } from "@/components/temperature/temperature-pivot-daily"
import { TemperaturePivotMonthly } from "@/components/temperature/temperature-pivot-monthly"
import { DischargeDetail } from "@/components/discharge/discharge-detail"
import { DischargePivotDaily } from "@/components/discharge/discharge-pivot-daily"
import { ResearchDocuments } from "@/components/research/research-documents"
import { ResearchAnalytics } from "@/components/research/research-analytics"
import { StationsSetup } from "@/components/setup/stations-setup"
import { ClimateScenarios } from "@/components/setup/climate-scenarios"
import { DataTypes } from "@/components/setup/data-types"
import { SPIAnalysis } from "@/components/research/spi-analysis"

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />
      case "rainfall-detail":
        return <RainfallDetail />
      case "rainfall-pivot-daily":
        return <RainfallPivotDaily />
      case "rainfall-pivot-monthly":
        return <RainfallPivotMonthly />
      case "temperature-detail":
        return <TemperatureDetail />
      case "temperature-pivot-daily":
        return <TemperaturePivotDaily />
      case "temperature-pivot-monthly":
        return <TemperaturePivotMonthly />
      case "discharge-detail":
        return <DischargeDetail />
      case "discharge-pivot-daily":
        return <DischargePivotDaily />
      case "research-documents":
        return <ResearchDocuments />
      case "research-analytics":
        return <ResearchAnalytics />
      case "spi-analysis":
        return <SPIAnalysis />
      case "stations-setup":
        return <StationsSetup />
      case "climate-scenarios":
        return <ClimateScenarios />
      case "data-types":
        return <DataTypes />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="flex pt-16">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 ml-64 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
