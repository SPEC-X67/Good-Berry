import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"

function VeryOtp() {
    return (
        <div className="verify-otp mx-auto w-full" style={{ maxWidth: "310px"}}>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-8">Verify OTP</h1>

      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot className="border-gray-300 w-11 h-12" index={0} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot className="border-gray-300 w-11 h-12" index={1} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot className="border-gray-300 w-11 h-12" index={2} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot className="border-gray-300 w-11 h-12" index={3} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot className="border-gray-300 w-11 h-12" index={4} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot className="border-gray-300 w-11 h-12" index={5} />
        </InputOTPGroup>
      </InputOTP>
        <p className="text-gray-800 mb-1 font-bold mt-3" style={{ fontSize: "11px" }}>0 : 5 9 </p>
        <Link className="text-primary mb-3 font-semibold">Resend</Link>
            <p className="text-gray-800 mb-1" style={{ fontSize: "10px" }}>By clicking on Verify button you agree to our <Link className="text-primary">Terms & Conditions</Link></p>
      <Button className="w-full font-bold">Verify</Button>
        </div>
    )
  }
  

export default VeryOtp