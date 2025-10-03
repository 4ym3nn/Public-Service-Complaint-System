export interface Complaint {
  id: number
  title: string
  description: string
  status: "open" | "in_progress" | "resolved"
  citizen: string
  created_at: string
  updated_at?: string
}

export interface CreateComplaintData {
  title: string
  description: string
}

export interface ComplaintStats {
  status: string
  count: number
}

import { AuthService } from "./auth"

export class ComplaintService {
  static async createComplaint(data: CreateComplaintData): Promise<Complaint> {
    const response = await AuthService.apiCall("/api/complaints/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to create complaint")
    }

    return response.json()
  }

  static async getMyComplaints(): Promise<Complaint[]> {
    const response = await AuthService.apiCall("/api/complaints/my/")

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch complaints")
    }

    return response.json()
  }

  static async getAllComplaints(filters?: { status?: string; citizen?: string }): Promise<Complaint[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.citizen) params.append("citizen__username", filters.citizen)

    const queryString = params.toString()
    const endpoint = `/api/complaints/all/${queryString ? `?${queryString}` : ""}`

    const response = await AuthService.apiCall(endpoint)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch complaints")
    }

    return response.json()
  }

  static async updateComplaint(id: number, data: { status: string }): Promise<Complaint> {
    const response = await AuthService.apiCall(`/api/complaints/${id}/update/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to update complaint")
    }

    return response.json()
  }

  static async getComplaintStats(): Promise<ComplaintStats[]> {
    const response = await AuthService.apiCall("/api/complaints/stats/")

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch stats")
    }

    return response.json()
  }
}
