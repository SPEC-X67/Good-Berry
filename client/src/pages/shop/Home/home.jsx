import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { ProductCategorySelector } from "./product-category-selector"
import { ProductSlider } from "./product-slider"
import { FeaturedProductCard } from "./featured-product-card"
import { featuredProducts, getProducts } from "@/store/shop-slice"
import { categoryTitle, blendjuice } from "@/assets/images"
import HeroBanner from "@/components/ui/hero-banner"
import { useNavigate } from "react-router-dom"

function ShoppingHome() {
  const page = 1
  const limit = 10
  const navigate = useNavigate()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(featuredProducts())
    dispatch(getProducts({ page, limit }))
  }, [dispatch])

  const { featuredProds, products } = useSelector((state) => state.shop)
  const [activeCategory, setActiveCategory] = React.useState("ice-cream")

  return (
    <div className="flex min-h-screen flex-col">
      <HeroBanner />

      {/* Featured Products Section */}
      <section className="featured-products bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-signika font-bold mb-4">Featured Products</h2>
            <div className="flex justify-center mb-2">
              <img
                src={categoryTitle || "/placeholder.svg"}
                alt="Decorative leaf"
                width={159}
                height={35}
                className="mx-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">There are many variations of passages of lorem ipsum available</p>
          </div>
          <div className="featured-products-grid grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4" style={{ maxWidth: "1100px" }}>
            {featuredProds.map((product, i) => (
              <FeaturedProductCard
                key={i}
                id={product._id}
                title={product.name}
                name={product.firstVariant.title}
                category={product.categoryName}
                price={product.firstVariant.salePrice}
                imageUrl={product.firstVariant.images}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blend Fruits Premium Section */}
      <section className="blendfruits-premium tpx-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-8xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <img
                src={blendjuice || "/placeholder.svg"}
                alt="Fresh fruits"
                width={692}
                height={526}
                className="blendjuice rounded-lg"
              />
            </div>
            <div className="blendjuice">
              <h2 className="text-5xl font-bold mb-4">Blend fruits premium drink</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">FRUITS</h3>
                  <p className="text-gray-600">Apple, Kiwi, Pineapple</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">PACKAGING</h3>
                  <p className="text-gray-600">Glass Bottle</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">SHELF LIFE</h3>
                  <p className="text-gray-600">365 Days</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">BOTTLE SIZE</h3>
                  <p className="text-gray-600">750ml</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-[#8CC63F] hover:bg-[#7AB32E] text-white" onClick={() => navigate("/shop")}>VIEW MORE</Button>
                <Button variant="outline" onClick={() => navigate("/shop")}>GO TO SHOP</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="our-products px-4 py-5 bg-[url('/src/assets//images/Categorys/fullwidth-row-prod-bg-opt.jpg')] bg-cover bg-center bg-no-repeat sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold mb-4 mt-10 font-signika">Our Products</h2>
            <div className="flex justify-center mb-2">
              <img src={categoryTitle || "/placeholder.svg"} className="w-50" alt="Category title" />
            </div>
            <p className="text-gray-600 text-sm">There are many variations of passages of lorem ipsum available</p>
          </div>

          <ProductCategorySelector activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          <ProductSlider products={products} />
        </div>
      </section>
    </div>
  )
}

export default ShoppingHome

