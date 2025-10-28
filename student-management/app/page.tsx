"use client"

import { useState } from "react"
import { StudentForm } from "@/components/student-form"
import { StudentList } from "@/components/student-list"
import { Statistics } from "@/components/statistics"
import { Users } from "lucide-react"

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleStudentAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
              <p className="text-muted-foreground">Manage and track student information</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <StudentForm onSuccess={handleStudentAdded} />
          </div>

          {/* Right Column - List and Stats */}
          <div className="lg:col-span-2 space-y-8">
            <Statistics refreshTrigger={refreshTrigger} />
            <StudentList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </main>
  )
}
