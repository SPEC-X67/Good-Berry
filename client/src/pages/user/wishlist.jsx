import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "@/store/shop-slice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.shop);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist ({wishlist.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <Card key={item._id} className="overflow-hidden">
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
                      onClick={() => handleRemove(item._id)}
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