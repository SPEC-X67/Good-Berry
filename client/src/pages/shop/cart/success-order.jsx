import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { CheckCircle, Package, ShoppingBag, Truck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export default function OrderSuccess() {
  useEffect(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-25" />
              <div className="relative">
                <CheckCircle className="w-20 h-20 mx-auto text-[#8CC63F]" />
              </div>
            </div>
            
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Order Successfully Placed!</h1>
            <p className="mt-2 text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <div className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-6 h-6 text-[#8CC63F]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-500">Your order has been received</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-[#8CC63F]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Processing</p>
                    <p className="text-sm text-gray-500">We&apos;re preparing your order</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shipping</p>
                    <p className="text-sm text-gray-500">Your order will be shipped soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button asChild className="w-full bg-[#8CC63F] hover:bg-[#8CC63F]">
              <Link to="/account/order">
                Track Your Order
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
