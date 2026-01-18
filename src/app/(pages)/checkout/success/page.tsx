"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center ">
      <div className="bg-transparent rounded-lg mt-20 p-8 mt-30">
        <div className="flex justify-center mb-4 ">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">Thank you for your purchase. You now have access to the course.</p>

        <div className="space-y-4">
          <Button className="w-full" onClick={() => router.push("/examprep/dashboard")}>
            Go to My Learning
          </Button>

          <Button variant="outline" className="w-full" onClick={() => router.push("/subscribe")}>
            Browse More Courses
          </Button>
        </div>
      </div>
    </div>
  )
}

