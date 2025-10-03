"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Complaint } from "@/lib/complaints"
import { useAuth } from "@/hooks/use-auth"

interface ComplaintDetailModalProps {
  complaint: Complaint | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdate?: (id: number, status: string, note?: string) => void
}

export function ComplaintDetailModal({ complaint, open, onOpenChange, onStatusUpdate }: ComplaintDetailModalProps) {
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const [updating, setUpdating] = useState(false)
  const { user } = useAuth()

  const canUpdateStatus = user && (user.role === "officer" || user.role === "admin")

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleStatusUpdate = async () => {
    if (!complaint || !newStatus || !onStatusUpdate) return

    setUpdating(true)
    try {
      await onStatusUpdate(complaint.id, newStatus, statusNote)
      setNewStatus("")
      setStatusNote("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setUpdating(false)
    }
  }

  if (!complaint) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl">{complaint.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Complaint #{complaint.id} • Submitted by {complaint.citizen}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(complaint.status)}>{getStatusLabel(complaint.status)}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Complaint Details */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Complaint Submitted</p>
                  <p className="text-xs text-muted-foreground">{formatDate(complaint.created_at)}</p>
                </div>
              </div>

              {complaint.updated_at && complaint.updated_at !== complaint.created_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-chart-3 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Status Updated</p>
                    <p className="text-xs text-muted-foreground">{formatDate(complaint.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Update Section (for officers/admins) */}
          {canUpdateStatus && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Update Status</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-status">New Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status-note">Update Note (Optional)</Label>
                  <Textarea
                    id="status-note"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                    className="min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={!newStatus || updating || newStatus === complaint.status}
                  className="w-full"
                >
                  {updating ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
