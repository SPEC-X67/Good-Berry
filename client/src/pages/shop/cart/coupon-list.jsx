import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Dummy data for coupons
const dummyCoupons = [
  { code: "SAVE10", description: "10% off your order" },
  { code: "FREESHIP", description: "Free shipping on orders over ₹1000" },
  { code: "BUNDLE20", description: "20% off when you buy 2 or more items" },
]

export default function CouponList({ onSelectCoupon }) {
  const [open, setOpen] = useState(false)

  const handleCouponSelect = (couponCode) => {
    onSelectCoupon(couponCode)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="text-[#8AB446] cursor-pointer">See Offers</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Available Coupons</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {dummyCoupons.map((coupon) => (
            <div key={coupon.code} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{coupon.code}</p>
                <p className="text-sm text-muted-foreground">{coupon.description}</p>
              </div>
              <Button onClick={() => handleCouponSelect(coupon.code)}>Apply</Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

