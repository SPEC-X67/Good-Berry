// import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="bg-[#FFF0F5] text-gray-700 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">INFORMATION</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-pink-500">About Us</Link></li>
              <li><Link href="/delivery" className="hover:text-pink-500">Delivery Information</Link></li>
              <li><Link href="/privacy" className="hover:text-pink-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-pink-500">Terms & Conditions</Link></li>
              <li><Link href="/contact" className="hover:text-pink-500">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">ACCOUNT</h3>
            <ul className="space-y-2">
              <li><Link href="/account" className="hover:text-pink-500">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-pink-500">Order History</Link></li>
              <li><Link href="/wishlist" className="hover:text-pink-500">Wish List</Link></li>
              <li><Link href="/newsletter" className="hover:text-pink-500">Newsletter</Link></li>
              <li><Link href="/returns" className="hover:text-pink-500">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">STORE INFORMATION</h3>
            <p>Good Berry,</p>
            <p>United States</p>
            <p className="mt-2">Call us: (123) 456-7890</p>
            <p>Email: info@goodberry.com</p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-gray-600 hover:text-pink-500">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-pink-500">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-pink-500">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-pink-500">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">NEWSLETTER</h3>
            <p className="mb-4">Subscribe to our newsletter and get 10% off your first purchase</p>
            <form className="flex flex-col space-y-2">
              <Input type="email" placeholder="Your email address" className="bg-white" />
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                SUBSCRIBE
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p>&copy; 2023 Good Berry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}