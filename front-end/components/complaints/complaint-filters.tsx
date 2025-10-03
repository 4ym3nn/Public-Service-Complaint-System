"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComplaintFiltersProps {
  onFiltersChange: (filters: { status?: string; citizen?: string }) => void
}

export function ComplaintFilters({ onFiltersChange }: ComplaintFiltersProps) {
  const [status, setStatus] = useState<string>("")
  const [citizen, setCitizen] = useState<string>("")

  const handleApplyFilters = () => {
    onFiltersChange({
      status: status || undefined,
      citizen: citizen || undefined,
    })
  }

  const handleClearFilters = () => {
    setStatus("")
    setCitizen("")
    onFiltersChange({})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filter Complaints</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="citizen-filter">Citizen Username</Label>
          <Input
            id="citizen-filter"
            type="text"
            value={citizen}
            onChange={(e) => setCitizen(e.target.value)}
            placeholder="Search by username"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleClearFilters} variant="outline" className="flex-1 bg-transparent">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
