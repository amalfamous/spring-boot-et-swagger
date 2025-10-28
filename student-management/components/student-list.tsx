"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteStudent, getAllStudents } from "@/lib/api"
import type { Student } from "@/lib/api"
import { Trash2, AlertCircle } from "lucide-react"

interface StudentListProps {
  refreshTrigger: number
}

export function StudentList({ refreshTrigger }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const formatDate = (value: string | undefined) => {
    if (!value) return "—"
    const date = new Date(value)
    return isNaN(date.getTime()) ? value : date.toLocaleDateString()
  }

  useEffect(() => {
    fetchStudents()
  }, [refreshTrigger])

  const fetchStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("[v0] StudentList: Starting fetch")
      const data = await getAllStudents()
      console.log("[v0] StudentList: Fetch successful, data:", data)
      setStudents(data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch students"
      console.error("[v0] StudentList: Fetch failed:", errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number | undefined) => {
    if (!id) return
    setDeleting(id)
    try {
      await deleteStudent(id)
      setStudents(students.filter((s) => s.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete student")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading students...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students List</CardTitle>
        <CardDescription>Total: {students.length} students</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Error loading students</p>
              <p className="text-xs text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        )}
        {students.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No students found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold">ID</th>
                  <th className="text-left py-2 px-4 font-semibold">Last Name</th>
                  <th className="text-left py-2 px-4 font-semibold">First Name</th>
                  <th className="text-left py-2 px-4 font-semibold">Date of Birth</th>
                  <th className="text-left py-2 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">{student.id}</td>
                    <td className="py-2 px-4">{student.nom}</td>
                    <td className="py-2 px-4">{student.prenom}</td>
                    <td className="py-2 px-4">{formatDate(student.dateNaissance)}</td>
                    <td className="py-2 px-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                        disabled={deleting === student.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
