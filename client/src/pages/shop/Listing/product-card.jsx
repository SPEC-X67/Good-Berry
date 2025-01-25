
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { Link } from "react-router-dom"

const ProductCard = ({ product, id }) => {
  return (
    <Card className="group overflow-hidden">
      <Link to={`/shop/product/${id}`} className="block">
        <div className="relative aspect-square">
          <img
            src={product.firstVariant.images || "/placeholder.svg"}
            alt={product.name}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.isNew && <Badge className="absolute left-2 top-2 bg-[#8cc63f] text-white">New</Badge>}
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <Badge className="bg-white text-black hover:bg-gray-200 transition-colors cursor-pointer">
              <Eye className="h-4 w-4 mr-1" />
              Quick View
            </Badge>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.categoryName}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#8cc63f]">₹{product.firstVariant.salePrice.toFixed(2)}</span>
          {product.firstVariant.price > product.firstVariant.salePrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.firstVariant.price.toFixed(2)}</span>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          {(((product.firstVariant.price - product.firstVariant.salePrice) / product.firstVariant.price) * 100).toFixed(
            0,
          )}
          % OFF
        </Badge>
      </CardFooter>
    </Card>
  )
}

export default ProductCard

