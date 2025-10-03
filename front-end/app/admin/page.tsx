"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProtectedRoute } from "@/components/dashboard/protected-route"
import { ComplaintFilters } from "@/components/complaints/complaint-filters"
import { ComplaintSearch } from "@/components/complaints/complaint-search"
import { EnhancedComplaintList } from "@/components/complaints/enhanced-complaint-list"
import { useAuth } from "@/hooks/use-auth"

export default function AdminDashboardPage() {
  const [filters, setFilters] = useState<{ status?: string; citizen?: string }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { user } = useAuth()

  const handleFiltersChange = (newFilters: { status?: string; citizen?: string }) => {
    setFilters(newFilters)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const getRoleTitle = (role: string) => {
    return role === "admin" ? "Administrator" : "Service Officer"
  }

  return (
    <ProtectedRoute allowedRoles={["officer", "admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getRoleTitle(user?.role || "")} Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and respond to citizen complaints across all public services.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <ComplaintSearch onSearch={handleSearch} placeholder="Search by title, description, or citizen..." />
              <ComplaintFilters onFiltersChange={handleFiltersChange} />
            </div>

            <div className="lg:col-span-3">
              <EnhancedComplaintList
                filters={filters}
                searchQuery={searchQuery}
                refreshTrigger={refreshTrigger}
                showCitizenInfo={true}
              />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
