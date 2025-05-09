"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ApiErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ApiErrorMessage({ message, onRetry }: ApiErrorMessageProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="self-start">
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
