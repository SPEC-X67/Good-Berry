import { useState, useEffect } from 'react'

import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '@/store/shop-slice/cart-slice'
import { useNavigate } from 'react-router-dom'

export default function ShoppingCart() {
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const { items } = useSelector(state => state.cart)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item?.price * item?.quantity), 0)
    setSubtotal(newSubtotal)
    setTotal(newSubtotal - discount)
  }, [items, discount])

  const handleQuantityChange = async (productId, currentQuantity, packageSize, flavor, action) => {
    const newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    
    if (newQuantity > 0) {
      await dispatch(updateCartItemQuantity({
        itemId: productId,
        packageSize,
        flavor,
        quantity: newQuantity
      }));
    }
  };

  const handleRemoveItem = async (productId, packageSize, flavor) => {
    await dispatch(removeFromCart({ 
      itemId: productId,    
      packageSize,
      flavor
    }));
  };

  const applyCoupon = () => {
    setDiscount(0)
    setCouponCode('')
  }

  return (
    <div className="container mx-auto p-6 md:px-12">
      <h2 className="text-xl font-medium my-2 md:px-8 px-4">Your cart</h2>
      
      <div className="flex flex-wrap gap-4 md:p-8 p-4">
        <div className="space-y-4 sm:w-full lg:w-2/3">
          {items.length === 0 ? (
            <p className="italic text-muted-foreground">No items in cart</p>
          ) : (
            items.map((item) => (
              <Card key={item.productId} className="w-full border-none border-b">
                <CardContent className="flex flex-wrap items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium">{item?.name}</h3>
                    <p className="text-sm text-muted-foreground">{item?.flavor} - {item.packageSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center rounded-md border">
                    <button
                      className="px-3 py-2 hover:bg-muted"
                      onClick={() => handleQuantityChange(item.productId, item.quantity, item.packageSize, item.flavor, 'decrease')}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item?.quantity}</span>
                    <button
                      className="px-3 py-2 hover:bg-muted"
                      onClick={() => handleQuantityChange(item.productId, item.quantity, item.packageSize, item.flavor, 'increase')}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-medium text-[#8CC63F]">₹{item?.price.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveItem(item.productId, item.packageSize, item.flavor)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            )
          ))}
        </div>

        <Card className="sm:w-full lg:w-[400px]">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Do you have any coupon? <span className="text-[#8AB446] cursor-pointer">See Offers</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
                <Button
                  variant="outline"
                  className="text-[#8AB446]"
                  onClick={applyCoupon}
                >
                  Apply
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span>-₹{discount?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-medium pt-4 border-t">
                <span>Total</span>
                <span>₹{total?.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full bg-[#8AB446] hover:bg-[#8AB446]/90" 
             onClick={() => navigate('/shop/cart/checkout')}
             disabled={items.length === 0}>
              Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
