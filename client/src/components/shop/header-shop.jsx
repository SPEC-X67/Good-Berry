import { Menu, Search, Heart, ShoppingCart, UserRound } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { logodark} from '@/assets/images';
import CartSidebar from '@/pages/shop/cart/cart-sidebar';
import { useState } from 'react';

function ShopHeader() {
    const user = useSelector(state => state.auth.user)
    const items = useSelector(state => state.cart.items)
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <header className="fixed top-0 z-50 w-full py-1 transition-colors home-header duration-300 bg-white">
        <div className="flex h-16 items-center px-4">
          <Button variant="transparent" size="icon" className="md:hidden text-black">
            <Menu className="h-8 w-8" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <nav className="hidden md:flex items-center space-x-6 ml-6 ">
            <Link to="/" className="text-sm font-medium text-black">
              HOME
            </Link>
            <Link to="/shop" className="text-sm font-medium text-black">
              SHOP
            </Link>
            <Link to="/contact" className="text-sm font-medium text-black">
              CONTACT US
            </Link>
            <Link to="/about" className="text-sm font-medium text-black">
              ABOUT US
            </Link>
          </nav>
  
          <div className="flex flex-1 items-center justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logodark} alt="Logo" className="lg:h-8 h-6" />
            </Link>
          </div>
  
          <div className="flex items-center me-6">
            <Link to={user ? '/account' : 'auth/login'} className="text-sm font-medium  text-black hidden md:block">
            {user ? <UserRound className="h-5 w-5 mx-2 text-black" /> : 'LOGIN/REGISTER'}
            </Link>
            <Button variant="transparent" size="icon">
              <Search className="h-5 w-5 text-black fw-bold" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="transparent" size="icon">
              <Heart className="h-5 w-5 text-black fw-bold" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button variant="transparent" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5 text-black fw-bold" />
              <span className="sr-only">Cart</span>
              <span className="absolute right-0 -top-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                {items.length}
              </span>
            </Button>
            <span className="text-sm font-bold text-black">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
        <CartSidebar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      </header>
    )
}

export default ShopHeader;