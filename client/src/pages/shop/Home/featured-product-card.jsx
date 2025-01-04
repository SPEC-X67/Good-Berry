import { Image } from "lucide-react"
import { Link } from "react-router-dom"

export function FeaturedProductCard({ name, category, price, imageUrl }) {
  return (
    <Link href="#" className="group block">
      <div className="aspect-square p-0 overflow-hidden bg-gray-100 rounded-lg">
        <Image
          src={imageUrl}
          alt={name}
          width={270}
          height={270}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className=" font-medium text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-700">{category}</p>
        <p className="mt-1 text-sm font-bold text-[#8CC63F]">€{price}</p>
      </div>
    </Link>
  )
}

