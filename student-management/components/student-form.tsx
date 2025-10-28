"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createStudent } from "@/lib/api"
import type { Student } from "@/lib/api"

interface StudentFormProps {
  onSuccess: () => void
}

export function StudentForm({ onSuccess }: StudentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Student>({
    nom: "",
    prenom: "",
    dateNaissance: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createStudent(formData)
      setFormData({ nom: "", prenom: "", dateNaissance: "" })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>Fill in the student information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium mb-1">
                First Name
              </label>
              <Input
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="dateNaissance" className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <Input
              id="dateNaissance"
              name="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
