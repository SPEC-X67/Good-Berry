import { useState } from 'react';
import {
  ShoppingCart,
  Heart,
  MapPin,
  Key,
  User,
  Wallet,
  LogOut,
  Package,
  Clock,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/auth-slice';

// Utility function for class names
const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// MenuItem Component
const MenuItem = ({ icon: Icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={classNames(
      "w-full flex items-center space-x-3 px-4 py-2 rounded-lg",
      "transition-colors duration-200",
      "hover:bg-gray-100 hover:text-gray-900",
      active ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600"
    )}
  >
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </button>
);

// Page Components
const OrdersPage = () => (
  <div className="space-y-4">
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Order #1234', 'Order #1235', 'Order #1236'].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Package className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">{order}</p>
                    <p className="text-sm text-gray-500">Placed on Jan 3, 2024</p>
                  </div>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const WishlistPage = () => {
  const wishlistItems = [
    {
      "id": 1,
      "name": "Chocolate Fudge Ice Cream",
      "price": 199.99,
      "image": "/api/placeholder/200/200",
      "inStock": true
    },
    {
      "id": 2,
      "name": "Orange Delight Juice",
      "price": 299.99,
      "image": "/api/placeholder/200/200",
      "inStock": true
    },
    {
      "id": 3,
      "name": "Strawberry Spread Jam",
      "price": 79.99,
      "image": "/api/placeholder/200/200",
      "inStock": false
    },
    {
      "id": 4,
      "name": "Cashew Crunch Dry Fruits",
      "price": 149.99,
      "image": "/api/placeholder/200/200",
      "inStock": true
    }
  ]  

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist ({wishlistItems.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-2xl font-bold">₹{item.price}</p>
                    <p className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      disabled={!item.inStock}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PasswordPage = () => (
  <Card>
    <CardHeader>
      <CardTitle>Change Password</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Current Password</label>
        <Input type="password" placeholder="Enter current password" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">New Password</label>
        <Input type="password" placeholder="Enter new password" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Confirm Password</label>
        <Input type="password" placeholder="Confirm new password" />
      </div>
      <Button className="w-full">Update Password</Button>
    </CardContent>
  </Card>
);

const AddressPage = () => (
  <Card>
    <CardHeader>
      <CardTitle>Shipping Address</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <Input placeholder="Enter first name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <Input placeholder="Enter last name" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Street Address</label>
        <Input placeholder="Enter street address" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <Input placeholder="Enter city" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <Input placeholder="Enter state" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code</label>
          <Input placeholder="Enter ZIP code" />
        </div>
      </div>
      <Button className="w-full">Save Address</Button>
    </CardContent>
  </Card>
);

const AccountDetailPage = () => (
  <Card>
    <CardHeader>
      <CardTitle>Account Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <Input placeholder="Enter full name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input type="email" placeholder="Enter email" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <Input placeholder="Enter phone number" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Date of Birth</label>
        <Input type="date" />
      </div>
      <Button className="w-full">Update Profile</Button>
    </CardContent>
  </Card>
);

const WalletPage = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">₹2,450.00</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { id: 1, type: 'Credit', amount: '+₹500', date: 'Jan 3, 2024' },
            { id: 2, type: 'Debit', amount: '-₹120', date: 'Jan 2, 2024' },
            { id: 3, type: 'Credit', amount: '+₹1000', date: 'Jan 1, 2024' },
          ].map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Clock className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <span className={transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}>
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

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