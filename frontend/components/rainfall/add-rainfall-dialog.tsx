"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { toast } from "sonner"
import { RainfallService } from "@/services/rainfallService"

interface AddRainfallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface RainfallFormData {
  date_measured: string
  rainfall_total: number
  station: string
  climate_scenario: string
}

export function AddRainfallDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddRainfallDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RainfallFormData>()

  const [stations, setStations] = useState<string[]>([])
  const [scenarios, setScenarios] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      // Load station and scenario options when dialog opens
      Promise.all([
        RainfallService.getStationOptions(),
        RainfallService.getClimateScenarios(),
      ])
        .then(([stationsRes, scenariosRes]) => {
          setStations(stationsRes)
          setScenarios(scenariosRes)
        })
        .catch(() => {
          toast.error("Failed to load dropdown options")
        })
    }
  }, [open])

  const onSubmit = async (values: RainfallFormData) => {
    try {
      await RainfallService.createRainfall(values)
      toast.success("Rainfall data saved")
      reset()
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      toast.error(error?.message || "Error saving rainfall data")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Rainfall Record</DialogTitle>
            <DialogDescription>
              Submit new rainfall measurement data.
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="date_measured">Date Measured</Label>
            <Input
              type="date"
              {...register("date_measured", { required: "Date is required" })}
            />
            {errors.date_measured && (
              <p className="text-sm text-red-500">{errors.date_measured.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="rainfall_total">Rainfall Total (mm)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("rainfall_total", {
                required: "Rainfall total is required",
                valueAsNumber: true,
              })}
            />
            {errors.rainfall_total && (
              <p className="text-sm text-red-500">{errors.rainfall_total.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="station">Station</Label>
            <Select
              onValueChange={(val) => setValue("station", val)}
              value={watch("station")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.code} value={station.code}>
                    {station.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.station && (
              <p className="text-sm text-red-500">Station is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="climate_scenario">Climate Scenario</Label>
            <Select
              onValueChange={(val) => setValue("climate_scenario", val)}
              value={watch("climate_scenario")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.climate_scenario} value={scenario.climate_scenario}>
                    {scenario.climate_scenario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.climate_scenario && (
              <p className="text-sm text-red-500">Scenario is required</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
