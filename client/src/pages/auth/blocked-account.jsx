import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mail, ArrowRight } from 'lucide-react'

export default function AccountBlocked() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">Account Blocked</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We&apos;ve detected unusual activity on your account and have temporarily blocked it for your security.
          </p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">Important</p>
            <p>If you believe this is a mistake, please contact our support team immediately.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" variant="default" onClick={() => window.location.href = 'mailto:shmnadthayyil8@gmail.com'}>
            <Mail className="mr-2 h-4 w-4" /> Contact Support
          </Button>
          <Button className="w-full" variant="outline">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

