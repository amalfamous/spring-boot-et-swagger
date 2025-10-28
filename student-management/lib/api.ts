const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

console.log("[v0] API_BASE_URL:", API_BASE_URL)

export interface Student {
  id?: number
  nom: string
  prenom: string
  dateNaissance: string
}

export interface StudentByYear {
  year: number
  count: number
}

// Create a new student
export async function createStudent(student: Student): Promise<Student> {
  try {
    // Ensure backend receives an ISO date-time per OpenAPI (format: date-time)
    const payload: Student = {
      ...student,
      dateNaissance: student.dateNaissance
        ? new Date(`${student.dateNaissance}T00:00:00`).toISOString()
        : "",
    }

    console.log("[v0] Creating student:", payload)
    const response = await fetch(`${API_BASE_URL}/students/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Create student error:", response.status, errorText)
      throw new Error(`Failed to create student: ${response.status}`)
    }
    const data = await response.json()
    console.log("[v0] Student created:", data)
    return data
  } catch (error) {
    console.error("[v0] Create student exception:", error)
    throw error
  }
}

// Get all students
export async function getAllStudents(): Promise<Student[]> {
  try {
    console.log("[v0] Fetching all students from:", `${API_BASE_URL}/students/all`)
    const response = await fetch(`${API_BASE_URL}/students/all`, { headers: { Accept: "application/json" } })
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Get all students error:", response.status, errorText)
      throw new Error(`Failed to fetch students: ${response.status} - ${errorText || ""}`)
    }
    const data = await response.json()
    console.log("[v0] Students fetched:", data)
    return data
  } catch (error) {
    console.error("[v0] Get all students exception:", error)
    throw error
  }
}

// Delete a student
export async function deleteStudent(id: number): Promise<void> {
  try {
    console.log("[v0] Deleting student:", id)
    const response = await fetch(`${API_BASE_URL}/students/delete/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Delete student error:", response.status, errorText)
      throw new Error(`Failed to delete student: ${response.status}`)
    }
    console.log("[v0] Student deleted:", id)
  } catch (error) {
    console.error("[v0] Delete student exception:", error)
    throw error
  }
}

// Get total student count
export async function getStudentCount(): Promise<number> {
  try {
    console.log("[v0] Fetching student count from:", `${API_BASE_URL}/students/count`)
    const response = await fetch(`${API_BASE_URL}/students/count`, { headers: { Accept: "application/json" } })
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Get count error:", response.status, errorText)
      throw new Error(`Failed to fetch count: ${response.status}`)
    }
    const data = await response.json()
    console.log("[v0] Student count:", data)
    return data
  } catch (error) {
    console.error("[v0] Get count exception:", error)
    throw error
  }
}

// Get students by birth year
export async function getStudentsByYear(): Promise<StudentByYear[]> {
  try {
    console.log("[v0] Fetching students by year from:", `${API_BASE_URL}/students/byYear`)
    const response = await fetch(`${API_BASE_URL}/students/byYear`, { headers: { Accept: "application/json" } })
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Get by year error:", response.status, errorText)
      throw new Error(`Failed to fetch students by year: ${response.status}`)
    }
    const data = await response.json()
    console.log("[v0] Students by year raw data:", data)
    // Support multiple backend shapes: [[year, count]] or [{ year, count }] or [{ annee, total }]
    const transformed: StudentByYear[] = Array.isArray(data)
      ? data.map((item: unknown) => {
          if (Array.isArray(item) && item.length >= 2) {
            const [y, c] = item
            return { year: Number(y), count: Number(c) }
          }
          if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>
            const year = (obj.year ?? obj.annee ?? obj.y) as number
            const count = (obj.count ?? obj.total ?? obj.c) as number
            if (typeof year === "number" && typeof count === "number") {
              return { year, count }
            }
          }
          throw new Error("Unsupported byYear response item shape")
        })
      : []
    console.log("[v0] Students by year transformed:", transformed)
    return transformed
  } catch (error) {
    console.error("[v0] Get by year exception:", error)
    throw error
  }
}
