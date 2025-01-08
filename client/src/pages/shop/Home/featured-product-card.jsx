import { Link } from "react-router-dom"

export function FeaturedProductCard({ name, category, price, imageUrl, id, title }) {
  return (
    <Link to={`/shop/product/${id}`} className="group block">
      <div className="aspect-square p-0 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          width={270}
          height={270}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className=" font-medium font-signika text-gray-900 ">{title}</h3>
        <p className="mt-1 font-semibold text-sm text-gray-400">{category}</p>
        <p className="mt-1 text-sm font-bold text-[#8CC63F]">₹{price}.00</p>
      </div>
    </Link>
  )
}

