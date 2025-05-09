import { redirect } from "next/navigation"

export default function Home() {
  // This will redirect on the server side before any UI is rendered
  redirect("/login")

  // The code below will never be executed
  return null
}
