"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudentCount, getStudentsByYear } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { StudentByYear } from "@/lib/api"
import { AlertCircle } from "lucide-react"

interface StatisticsProps {
  refreshTrigger: number
}

export function Statistics({ refreshTrigger }: StatisticsProps) {
  const [totalCount, setTotalCount] = useState(0)
  const [studentsByYear, setStudentsByYear] = useState<StudentByYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStatistics()
  }, [refreshTrigger])

  const fetchStatistics = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("[v0] Statistics: Starting fetch")
      const [count, byYear] = await Promise.all([getStudentCount(), getStudentsByYear()])
      console.log("[v0] Statistics: Fetch successful, count:", count, "byYear:", byYear)
      setTotalCount(count)
      setStudentsByYear(byYear.sort((a, b) => a.year - b.year))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch statistics"
      console.error("[v0] Statistics: Fetch failed:", errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
          <CardDescription>Overall student count</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md flex gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Error loading statistics</p>
                <p className="text-xs text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="text-4xl font-bold text-primary">{totalCount}</div>
          )}
        </CardContent>
      </Card>

      {studentsByYear.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Students by Birth Year</CardTitle>
            <CardDescription>Distribution of students across birth years</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsByYear}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="var(--color-primary)" name="Number of Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
