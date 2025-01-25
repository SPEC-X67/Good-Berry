// import { Link } from "react-router-dom"

// export function FeaturedProductCard({ name, category, price, imageUrl, id, title }) {
//   return (
//     <Link to={`/shop/product/${id}`} className="group block">
//       <div className="aspect-square p-0 overflow-hidden bg-gray-100">
//         <img
//           src={imageUrl}
//           alt={name}
//           width={270}
//           height={270}
//           className="h-full w-full object-contain"
//         />
//       </div>
//       <div className="mt-4 text-center">
//         <h3 className=" font-medium font-signika text-gray-900 ">{title}</h3>
//         <p className="mt-1 font-semibold text-sm text-gray-400">{category}</p>
//         <p className="mt-1 text-sm font-bold text-[#8CC63F]">₹{price}.00</p>
//       </div>
//     </Link>
//   )
// }

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

export function FeaturedProductCard({ name, category, price, imageUrl, id, title }) {
  return (
    <Link to={`/shop/product/${id}`} className="block group">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-signika text-lg font-medium text-gray-900 line-clamp-1">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-gray-500">{category}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-bold text-[#8CC63F]">₹{Number.parseFloat(price).toFixed(2)}</p>
            <Badge variant="outline" className="text-xs">
              View Details
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}



