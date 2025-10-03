"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProtectedRoute } from "@/components/dashboard/protected-route"
import { ComplaintForm } from "@/components/complaints/complaint-form"
import { ComplaintSearch } from "@/components/complaints/complaint-search"
import { EnhancedComplaintList } from "@/components/complaints/enhanced-complaint-list"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  const handleComplaintSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <ProtectedRoute allowedRoles={["citizen"]}>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}</h1>
            <p className="text-muted-foreground">Submit new complaints or track the status of your existing ones.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ComplaintForm onSuccess={handleComplaintSuccess} />
              <ComplaintSearch onSearch={handleSearch} placeholder="Search your complaints..." />
            </div>

            <div>
              <EnhancedComplaintList
                searchQuery={searchQuery}
                refreshTrigger={refreshTrigger}
                showCitizenInfo={false}
              />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
