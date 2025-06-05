"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  CloudRain,
  Thermometer,
  Droplet,
  BookOpen,
  Settings,
  Home,
  FileBarChart,
} from "lucide-react"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    )
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => setActiveView("dashboard"),
    },
    {
      id: "rainfall",
      label: "Rainfall Data",
      icon: CloudRain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      children: [
        { id: "rainfall-detail", label: "Detail View", action: () => setActiveView("rainfall-detail") },
        { id: "rainfall-pivot-daily", label: "Daily Pivot", action: () => setActiveView("rainfall-pivot-daily") },
        { id: "rainfall-pivot-monthly", label: "Monthly Pivot", action: () => setActiveView("rainfall-pivot-monthly") },
      ],
    },
    {
      id: "temperature",
      label: "Temperature Data",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      children: [
        { id: "temperature-detail", label: "Detail View", action: () => setActiveView("temperature-detail") },
        { id: "temperature-pivot-daily", label: "Daily Pivot", action: () => setActiveView("temperature-pivot-daily") },
        {
          id: "temperature-pivot-monthly",
          label: "Monthly Pivot",
          action: () => setActiveView("temperature-pivot-monthly"),
        },
      ],
    },
    {
      id: "discharge",
      label: "Discharge Data",
      icon: Droplet, // ✅ Stable and available in lucide-react
      color: "text-green-600",
      bgColor: "bg-green-50",
      children: [
        { id: "discharge-detail", label: "Detail View", action: () => setActiveView("discharge-detail") },
        { id: "discharge-pivot-daily", label: "Daily Pivot", action: () => setActiveView("discharge-pivot-daily") },
      ],
    },
    {
      id: "research",
      label: "Research Papers",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      children: [
        { id: "research-documents", label: "Documents", action: () => setActiveView("research-documents") },
        { id: "research-analytics", label: "Analytics", action: () => setActiveView("research-analytics") },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileBarChart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      children: [{ id: "spi-analysis", label: "SPI Analysis", action: () => setActiveView("spi-analysis") }],
    },
    {
      id: "setup",
      label: "Setup",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      children: [
        { id: "stations-setup", label: "Stations Setup", action: () => setActiveView("stations-setup") },
        { id: "climate-scenarios", label: "Climate Scenarios", action: () => setActiveView("climate-scenarios") },
        { id: "data-types", label: "Data Types", action: () => setActiveView("data-types") },
      ],
    },
  ]

  const renderMenuItem = (item: any, level = 0) => {
    const isExpanded = expandedMenus.includes(item.id)
    const hasChildren = item.children && item.children.length > 0
    const isActive = activeView === item.id
    const paddingLeft = level === 0 ? "pl-4" : level === 1 ? "pl-8" : "pl-12"

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between py-2 px-2 mx-2 rounded-lg cursor-pointer transition-colors ${
            isActive
              ? `${item.bgColor || "bg-gray-100"} ${item.color || "text-gray-900"}`
              : "text-white hover:bg-blue-800"
          } ${paddingLeft}`}
          onClick={() => {
            if (!hasChildren && item.action) {
              item.action()
            }
          }}
        >
          <div className="flex items-center space-x-3">
            {level === 0 && item.icon && <item.icon className={`h-5 w-5 ${isActive ? item.color : "text-white"}`} />}
            {level === 1 && <div className="w-2 h-2 bg-current rounded-full opacity-60" />}
            {level === 2 && <div className="w-1 h-1 bg-current rounded-full opacity-60" />}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          {hasChildren && (
            <div
              className="text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                toggleMenu(item.id)
              }}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">{item.children.map((child: any) => renderMenuItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-blue-900 overflow-y-auto">
      <div className="py-4">
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold text-white">Navigation</h2>
        </div>
        <nav className="space-y-1">{menuItems.map((item) => renderMenuItem(item))}</nav>
      </div>
    </div>
  )
}
