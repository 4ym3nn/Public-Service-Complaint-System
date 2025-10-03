"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComplaintService, type Complaint } from "@/lib/complaints"

interface ComplaintListProps {
  refreshTrigger?: number
}

export function ComplaintList({ refreshTrigger }: ComplaintListProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchComplaints()
  }, [refreshTrigger])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const data = await ComplaintService.getMyComplaints()
      setComplaints(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch complaints")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-destructive/10 text-destructive"
      case "in_progress":
        return "bg-chart-3/10 text-chart-3"
      case "resolved":
        return "bg-accent/10 text-accent"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Open"
      case "in_progress":
        return "In Progress"
      case "resolved":
        return "Resolved"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading your complaints...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (complaints.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Complaints Yet</h3>
            <p className="text-muted-foreground">
              You haven't submitted any complaints. Use the form above to report an issue.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Complaints</h3>
        <span className="text-sm text-muted-foreground">{complaints.length} total</span>
      </div>

      {complaints.map((complaint) => (
        <Card key={complaint.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base">{complaint.title}</CardTitle>
                <CardDescription className="mt-1">Submitted on {formatDate(complaint.created_at)}</CardDescription>
              </div>
              <Badge className={getStatusColor(complaint.status)}>{getStatusLabel(complaint.status)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3">{complaint.description}</p>
            {complaint.updated_at && complaint.updated_at !== complaint.created_at && (
              <p className="text-xs text-muted-foreground mt-2">Last updated: {formatDate(complaint.updated_at)}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
