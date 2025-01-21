import { useState, useEffect } from 'react'

import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '@/store/shop-slice/cart-slice'
import { applyCoupon, checkCoupon } from '@/store/shop-slice'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export default function ShoppingCart() {
  const [couponCode, setCouponCode] = useState('')
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const { items } = useSelector(state => state.cart)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { coupon } = useSelector(state => state.shop);

  const couponDiscount = coupon?.discount || 0; 

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item?.price * item?.quantity), 0)
    const discount = newSubtotal - items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    setDiscount(discount)
    setSubtotal(newSubtotal)
    setTotal(newSubtotal - discount - couponDiscount)
  }, [items, discount, couponDiscount])

  useEffect(() => {
    if (couponCode) {
      dispatch(checkCoupon({ code: couponCode, total }));
    }
  }, [dispatch, total]);

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

  const handleApplyCoupon = async () => {
    try {
      const response = await dispatch(applyCoupon({ code: couponCode, total })).unwrap();
      if(response.success) {
        toast({
          title: `Coupon applied successfully`,
          description: response.message
        });
      } else  {
        toast({
          title: `Error applying coupon`,
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: `Error applying coupon`,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

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
                <CardContent className="flex flex-wrap items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center gap-4" onClick={() => navigate(`/shop/product/${item.productId}`)}>
                    <img
                      src={item?.image}
                      alt={item?.name}
                      width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <div onClick={() => navigate(`/shop/product/${item.productId}`)}>
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
                  disabled={coupon.discount}
                />
                <Button
                  variant="outline"
                  className="text-[#8AB446]"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || coupon.discount}
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

              {coupon.discount &&<div className="flex justify-between text-muted-foreground">
                <span>Coupon</span>
                <span>-₹{couponDiscount?.toFixed(2)}</span>
              </div>}
              
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
