import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "@/store/shop-slice";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.shop);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (productId, variantId) => {
    dispatch(removeFromWishlist({ productId, variantId }));
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No items in your wishlist yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist ({wishlist.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <Card key={item.productId} className="flex flex-col h-full">
                <CardContent
                  className="flex-grow cursor-pointer pb-1"
                  onClick={() => navigate(`/shop/product/${item.productId}`)}
                >
                  <div className="aspect-square relative my-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <p className={`text-sm ${item.stockStatus === "OUT OF STOCK" ? "text-red-600" : item.stockStatus.includes("Limited Stock") ? "text-yellow-600" : "text-green-600"}`}>
                    {item.stockStatus}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">₹{item.salePrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 line-through">₹{item.price.toFixed(2)}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleRemove(item.productId, item.variantId)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistPage;