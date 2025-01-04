import { Menu, Search, Heart, ShoppingCart, UserRound } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { logodark, logolight } from '@/assets/images';

function HomeHeader() {

    const [isScrolled, setIsScrolled] = useState(false)
    const user = useSelector(state => state.auth.user)

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 80)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 z-50 w-full py-1 transition-colors duration-300  ${isScrolled ? 'bg-white home-header' : 'bg-transparent'}`}>
        <div className="flex h-16 items-center px-4">
          <Button variant="transparent" size="icon" className={`md:hidden  ${isScrolled ? 'text-black' : 'text-white'}`}>
            <Menu className="h-8 w-8" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <nav className="hidden md:flex items-center space-x-6 ml-6 ">
            <Link to="/" className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
              HOME
            </Link>
            <Link to="/shop" className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
              SHOP
            </Link>
            <Link to="/contact" className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
              CONTACT US
            </Link>
            <Link to="/about" className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
              ABOUT US
            </Link>
          </nav>
  
          <div className="flex flex-1 items-center justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={isScrolled ? logodark : logolight} alt="Logo" className="lg:h-8 h-6" />
            </Link>
          </div>
  
          <div className="flex items-center me-6">
            <Link to={user ? '/account' : 'auth/login'} className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'} hidden md:block`}>
            {user ? <UserRound className={`h-5 w-5 mx-2 ${isScrolled ? 'text-black' : 'text-white'}`}/> : 'LOGIN/REGISTER'}
            </Link>
            <Button variant="transparent" size="icon">
              <Search className={`h-5 w-5 ${isScrolled ? 'text-black' : 'text-white'} fw-bold`} />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="transparent" size="icon">
              <Heart className={`h-5 w-5 ${isScrolled ? 'text-black' : 'text-white'} fw-bold`} />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button variant="transparent" size="icon" className="relative">
              <ShoppingCart className={`h-5 w-5 ${isScrolled ? 'text-black' : 'text-white'} fw-bold`} />
              <span className="sr-only">Cart</span>
              <span className="absolute right-0 -top-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                0
              </span>
            </Button>
            <span className={`text-sm font-bold  ${isScrolled ? 'text-black' : 'text-white'}`}>$0.00</span>
          </div>
        </div>
      </header>
    )
}

export default HomeHeader;