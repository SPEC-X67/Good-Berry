import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">Unauthorized Access</h1>
        <p className="mb-6 text-center text-gray-600">
          Oops! It seems you don&apos;t have permission to access this page. Please log in or contact an administrator if you
          believe this is an error.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}