"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CloudRain, LayoutDashboard, BarChart3, Map, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated")
    setIsAuthenticated(authStatus === "true")
    setIsLoading(false)

    // If not authenticated, redirect to login
    if (authStatus !== "true") {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Rainfall Data", href: "/dashboard/rainfall", icon: CloudRain },
    { name: "Stations", href: "/dashboard/stations", icon: Map },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-2 py-4">
                    <CloudRain className="h-6 w-6 text-emerald-500" />
                    <span className="text-xl font-bold">RainfallDB</span>
                  </div>
                  <nav className="flex-1 space-y-2 py-4">
                    {navItems.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </Button>
                    ))}
                  </nav>
                  <Button variant="outline" className="mt-auto w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden md:flex md:items-center md:gap-2">
              <CloudRain className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">RainfallDB</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Button key={item.name} variant="ghost" className="justify-start" onClick={() => router.push(item.href)}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
