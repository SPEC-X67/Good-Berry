import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Search } from "lucide-react";

export default function ProductCard({ product, id}) {
  return (
    <Link to={`/shop/product/${id}`}>
    <div className="group relative bg-white rounded-lg text-center">
      <div className="relative aspect-square overflow-hidden">
      
          <img src={product.firstVariant.images} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 bg-[rgb(250,250,250)]" />
        {product.isNew && (
          <Badge className="absolute text-center left-4 top-4 bg-[#438e44] w-12 h-12">
            {product.isNew && "New"}
          </Badge>
        )}
        {/* Quick actions */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white hover:bg-[#8CC63F] hover:text-white"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white hover:bg-[#8CC63F] hover:text-white"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Quick view</span>
            </Button>
            <Button
              variant="secondary"
              className="h-10 rounded-full bg-white px-6 hover:bg-[#8CC63F] hover:text-white"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.categoryName}</p>
          <div className="mt-1 text-sm font-medium text-[#8CC63F]">
            <span>₹{product.firstVariant.salePrice.toFixed(2)}</span>
          </div>
      </div>
    </div>
    </Link>
  );
}
