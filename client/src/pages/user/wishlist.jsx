import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Trash2 } from "lucide-react";

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

export default WishlistPage;