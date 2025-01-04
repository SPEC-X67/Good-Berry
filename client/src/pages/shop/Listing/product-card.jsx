import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Image, Search } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <div className="group relative bg-white rounded-lg">
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/shop/${product.slug}`}>
          <Image className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
        </Link>
        {product.badge && (
          <Badge className="absolute left-4 top-4 bg-[#8CC63F]">
            {product.badge}
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
        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-[#8CC63F]">{product.category}</p>
          <div className="mt-1 text-sm font-medium text-gray-900">
            {product.priceRange ? (
              <span>
                €{product.priceRange.min.toFixed(2)} - €
                {product.priceRange.max.toFixed(2)}
              </span>
            ) : (
              <span>€{product.price.toFixed(2)}</span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
