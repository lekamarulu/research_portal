import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, CloudRain, MapPin } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <CloudRain className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">RainfallDB</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Rainfall Data Management System
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Access and analyze rainfall and station data with our comprehensive dashboard. Monitor climate
                    scenarios and track rainfall patterns.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Rainfall Insights</CardTitle>
                    <CardDescription>Latest rainfall data across stations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                          <CloudRain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="grid gap-1">
                          <p className="text-sm font-medium">RCP4.5 Scenario</p>
                          <p className="text-xs text-muted-foreground">Moderate emissions pathway</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="grid gap-1">
                          <p className="text-sm font-medium">Multiple Stations</p>
                          <p className="text-xs text-muted-foreground">Data from various monitoring stations</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-4">
                <h2 className="text-3xl font-bold">Key Features</h2>
                <ul className="grid gap-4">
                  <li className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                      1
                    </div>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Climate Scenario Analysis</h3>
                      <p className="text-muted-foreground">
                        Compare RCP4.5 and RCP8.5 climate scenarios to understand different climate futures.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                      2
                    </div>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Station Management</h3>
                      <p className="text-muted-foreground">
                        View and manage rainfall monitoring stations with detailed information.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                      3
                    </div>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Data Visualization</h3>
                      <p className="text-muted-foreground">
                        Visualize rainfall data with interactive charts and tables.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>API Access</CardTitle>
                    <CardDescription>Programmatic access to rainfall data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our system provides a comprehensive API for accessing rainfall and station data programmatically.
                      Perfect for researchers and developers building climate applications.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Create, update, and delete records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Easily manage your rainfall data with our intuitive interface. Add new records, update existing
                      ones, and maintain your database with ease.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-emerald-500" />
            <span className="text-lg font-semibold">RainfallDB</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} RainfallDB. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
