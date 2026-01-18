import { Suspense } from "react"
import CourseList from "@/components/course-list"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center mt-16">
        <h1 className="text-3xl font-bold tracking-tight">Premium Courses</h1>
        <p className="mt-2 text-muted-foreground mt-4">Expand your skills with our expert-led courses</p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading courses...</span>
          </div>
        }
      >
        <CourseList />
      </Suspense>
    </main>
  )
}

