import { useState } from 'react';
import {
  ShoppingCart,
  Heart,
  MapPin,
  Key,
  User,
  Wallet,
  LogOut,
  Award,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/auth-slice';
import OrdersPage from './orders';
import WishlistPage from './wishlist';
import PasswordPage from './password';
import AddressPage from './address';
import AccountDetailPage from './account-detail'; 
import WalletPage from './wallet';
import MenuItem from './menu-item';
import ReferAndEarn from './reffer';

const handleLogout = (dispatch) => {
  dispatch(logoutUser());
};

// Main Dashboard Component
const Account = () => {
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState('Orders');
  const menuItems = [
    { icon: ShoppingCart, text: 'Orders', component: OrdersPage },
    { icon: Heart, text: 'Wishlist', component: WishlistPage },
    { icon: MapPin, text: 'Address', component: AddressPage },
    { icon: Key, text: 'Password', component: PasswordPage },
    { icon: User, text: 'Account Details', component: AccountDetailPage },
    { icon: Wallet, text: 'Wallet', component: WalletPage },
    { icon: Award , text: 'Refer & Earn', component: ReferAndEarn },
    { icon: LogOut, text: 'Logout'},
  ];

  const ActiveComponent = menuItems.find(item => item.text === activeItem)?.component || null;

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-white lg:pl-9 lg:pt-9 p-4 space-y-1">
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            active={activeItem === item.text}
            onClick={() => setActiveItem(item.text)}
          />
        ))}
      </div>
      
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        {ActiveComponent ? <ActiveComponent /> : handleLogout(dispatch)}
      </div>
    </div>
  );
};

export default Account;