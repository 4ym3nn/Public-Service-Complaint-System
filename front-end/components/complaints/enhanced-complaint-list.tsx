"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ComplaintDetailModal } from "./complaint-detail-modal"
import { ComplaintService, type Complaint } from "@/lib/complaints"
import { useAuth } from "@/hooks/use-auth"

interface EnhancedComplaintListProps {
  filters?: { status?: string; citizen?: string }
  searchQuery?: string
  refreshTrigger?: number
  showCitizenInfo?: boolean
}

export function EnhancedComplaintList({
  filters,
  searchQuery,
  refreshTrigger,
  showCitizenInfo = false,
}: EnhancedComplaintListProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()

  const canUpdateStatus = user && (user.role === "officer" || user.role === "admin")

  useEffect(() => {
    fetchComplaints()
  }, [filters, refreshTrigger])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const data = showCitizenInfo
        ? await ComplaintService.getAllComplaints(filters)
        : await ComplaintService.getMyComplaints()
      setComplaints(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch complaints")
    } finally {
      setLoading(false)
    }
  }

  const filteredComplaints = useMemo(() => {
    if (!searchQuery) return complaints

    const query = searchQuery.toLowerCase()
    return complaints.filter(
      (complaint) =>
        complaint.title.toLowerCase().includes(query) ||
        complaint.description.toLowerCase().includes(query) ||
        complaint.citizen.toLowerCase().includes(query),
    )
  }, [complaints, searchQuery])

  const handleStatusUpdate = async (id: number, status: string, note?: string) => {
    try {
      await ComplaintService.updateComplaint(id, { status })

      // Update local state
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === id
            ? { ...complaint, status: status as any, updated_at: new Date().toISOString() }
            : complaint,
        ),
      )

      // Update selected complaint if it's the one being updated
      if (selectedComplaint?.id === id) {
        setSelectedComplaint((prev) =>
          prev ? { ...prev, status: status as any, updated_at: new Date().toISOString() } : null,
        )
      }
    } catch (err) {
      throw err
    }
  }

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setModalOpen(true)
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
          <div className="text-center text-muted-foreground">Loading complaints...</div>
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

  if (filteredComplaints.length === 0) {
    return (
      <>
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
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No Matching Complaints" : "No Complaints Found"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No complaints match your search criteria."
                  : "No complaints match your current filters."}
              </p>
            </div>
          </CardContent>
        </Card>

        <ComplaintDetailModal
          complaint={selectedComplaint}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onStatusUpdate={canUpdateStatus ? handleStatusUpdate : undefined}
        />
      </>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{showCitizenInfo ? "All Complaints" : "Your Complaints"}</h3>
          <span className="text-sm text-muted-foreground">
            {filteredComplaints.length} {searchQuery ? "matching" : "total"}
          </span>
        </div>

        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{complaint.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {showCitizenInfo && `By ${complaint.citizen} • `}
                    {formatDate(complaint.created_at)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(complaint.status)}>{getStatusLabel(complaint.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{complaint.description}</p>

              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => handleComplaintClick(complaint)}>
                  View Details
                </Button>

                {complaint.updated_at && complaint.updated_at !== complaint.created_at && (
                  <p className="text-xs text-muted-foreground">Updated: {formatDate(complaint.updated_at)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ComplaintDetailModal
        complaint={selectedComplaint}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onStatusUpdate={canUpdateStatus ? handleStatusUpdate : undefined}
      />
    </>
  )
}
