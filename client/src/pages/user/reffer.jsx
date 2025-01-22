import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, CheckCircle } from "lucide-react"

export default function ReferAndEarn() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [appliedCode, setAppliedCode] = useState("")
  const [applyResult, setApplyResult] = useState("")
  const referralCodeRef = useRef(null)
  const applyCodeRef = useRef(null)

  const userReferralCode = "TESTCODE"

  const copyReferralCode = () => {
    if (referralCodeRef.current) {
      referralCodeRef.current.select()
      document.execCommand("copy")
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const applyReferralCode = () => {
    const enteredCode = applyCodeRef.current?.value
    if (enteredCode) {
      if (enteredCode === userReferralCode) {
        setApplyResult("Success! You've earned a 50% discount.")
      } else {
        setApplyResult("Invalid code. Please try again.")
      }
      setAppliedCode(enteredCode)
    }
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Refer a Friend & Earn</CardTitle>
          <CardDescription>Share your unique code and both you and your friend get 50% off!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="referral-code" className="block text-sm font-medium text-gray-700 mb-2">
              Your Referral Code
            </label>
            <div className="flex">
              <Input
                id="referral-code"
                ref={referralCodeRef}
                value={userReferralCode}
                readOnly
                className="rounded-r-none"
              />
              <Button onClick={copyReferralCode} className="rounded-l-none" variant="outline">
                {copiedCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <label htmlFor="apply-code" className="block text-sm font-medium text-gray-700 mb-2">
              Apply a Referral Code
            </label>
            <div className="flex">
              <Input id="apply-code" ref={applyCodeRef} placeholder="Enter code" className="rounded-r-none" />
              <Button onClick={applyReferralCode} className="rounded-l-none">
                Apply
              </Button>
            </div>
          </div>
          {appliedCode && (
            <div className={`text-sm ${applyResult.includes("Success") ? "text-green-600" : "text-red-600"}`}>
              {applyResult}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">Terms and conditions apply. Offer valid for new customers only.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

