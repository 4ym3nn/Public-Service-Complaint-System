"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProtectedRoute } from "@/components/dashboard/protected-route"
import { StatsCards } from "@/components/analytics/stats-cards"
import { ComplaintChart } from "@/components/analytics/complaint-chart"
import { RecentActivity } from "@/components/analytics/recent-activity"
import { ComplaintService, type ComplaintStats } from "@/lib/complaints"
import { useAuth } from "@/hooks/use-auth"

export default function AnalyticsPage() {
  const [stats, setStats] = useState<ComplaintStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await ComplaintService.getComplaintStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch statistics")
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track complaint trends and performance metrics across all public services.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Stats Cards */}
            <StatsCards stats={stats} loading={loading} />

            {/* Charts */}
            <ComplaintChart stats={stats} loading={loading} />

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <RecentActivity />
              </div>
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Resolution Rate</span>
                      <span className="text-sm font-medium">
                        {stats.length > 0
                          ? (
                              ((stats.find((s) => s.status === "resolved")?.count || 0) /
                                stats.reduce((sum, s) => sum + s.count, 0)) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending Review</span>
                      <span className="text-sm font-medium">{stats.find((s) => s.status === "open")?.count || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">In Progress</span>
                      <span className="text-sm font-medium">
                        {stats.find((s) => s.status === "in_progress")?.count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
