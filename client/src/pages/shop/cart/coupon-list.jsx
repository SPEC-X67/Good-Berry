import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDispatch, useSelector } from "react-redux"
import { getCoupons } from "@/store/shop-slice/cart-slice"


export default function CouponList({ onSelectCoupon }) {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(getCoupons())
  },[])
  
  console.log(coupons);
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
        <div className="grid gap-4 py-4 no-scrollbar" style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {loading ? "Loading..." : ""}
          {coupons.map((coupon) => (
            <div key={coupon._id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{coupon.code}</p>
                <p className="text-sm text-muted-foreground">{coupon.description}</p>
              </div>
              <Button onClick={() => handleCouponSelect(coupon.code)}>Copy</Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

