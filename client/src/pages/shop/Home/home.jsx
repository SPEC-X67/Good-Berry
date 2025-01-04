import { Button } from "@/components/ui/button";
import heroProduct from "../../../assets/hero/organic-slide-1-img-535x487.png";
import { ProductCategorySelector } from "./product-category-selector";
import { Image } from "lucide-react";
import { useState } from "react";
import { blendjuice, categoryTitle } from "@/assets/images";
import { ProductSlider } from "./product-slider";
import { FeaturedProductCard } from "./featured-product-card";

const featuredProducts = [
  { name: 'Rutrum eget congue', category: 'Organic', price: '269.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  { name: 'Sed ligula magna', category: 'Organic', price: '399.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  { name: 'Blandit esuris aliquet', category: 'Organic', price: '169.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  { name: 'Porttitor accumsan tincidunt', category: 'Organic', price: '19.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  { name: 'Tortor vivamus suscipit', category: 'Organic', price: '379.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  { name: 'Blandit aliquet mauris', category: 'Organic', price: '267.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  { name: 'Suscipit eget tortor', category: 'Organic', price: '203.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  { name: 'Curabitur arcu accumsan', category: 'Organic', price: '487.00', imageUrl: '/placeholder.svg?height=300&width=300' },
]

const products = {
  'ice-cream': [
    { name: 'Erat curabitur arcu', category: 'Ice Cream', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Ice Cream', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Ice Cream', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Ice Cream', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Ice Cream', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  ],
  'fruit-tea': [
    { name: 'Erat curabitur arcu', category: 'Fruit Tea', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Fruit Tea', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Fruit Tea', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Fruit Tea', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Fruit Tea', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  ],
  'fruit-jam': [
    { name: 'Erat curabitur arcu', category: 'Fruit Jam', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Fruit Jam', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Fruit Jam', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Fruit Jam', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Fruit Jam', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  ],
  'juice': [
    { name: 'Erat curabitur arcu', category: 'Juice', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Juice', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Juice', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Juice', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Juice', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  ],
  'snacks': [
    { name: 'Erat curabitur arcu', category: 'Snacks', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Snacks', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Snacks', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Snacks', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
    { name: 'Erat curabitur arcu', category: 'Snacks', price: '69.00', imageUrl: '/placeholder.svg?height=300&width=300' },
  ],
};


function ShoppingHome() {
  const [activeCategory, setActiveCategory] = useState('ice-cream')
    return (
        <div className="flex min-h-screen flex-col">
  
        {/* Hero Section */}
        <section className="relative bg-[url('/src/assets/hero/organic-slide-bg-1.jpg')] bg-cover bg-center bg-no-repeat px-4 py-16 sm:px-6 lg:px-8 overflow-hidden" style={{ height: "100vh" }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
              <div className="relative z-10 mt-5">
                <img src={heroProduct} alt="Ice Cream" className="mt-12" />
              </div>
              <div className="hero flex flex-col justify-center text-right p-12">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  SOUR <br />
                  GREEN APPLE<br />
                  ICE CREAM
                </h1>
                <p className="mt-4 text-lg text-white/90">
                  IT IS A LONG ESTABLISHED FACT THAT A READER WILL
                </p>
                <div className="b-block mt-8 flex gap-4">
                  <Button
                    size="lg"
                    className="border-2 bg-transparent text-white hover:bg-white/90 hover:text-black rounded-full h-12"
                  >
                    SHOP NOW
                  </Button>
                  <Button
                    size="lg"
                    className="bg-[#83ac2b] hover:bg-[#7AB32E] text-white rounded-full h-12"
                  >
                    VIEW MORE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

         {/* Featured Products Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-signika font-bold mb-4">Featured Products</h2>
            <div className="flex justify-center mb-2">
              <img
                src={categoryTitle}
                alt="Decorative leaf"
                width={159}
                height={35}
                className="mx-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">
              There are many variations of passages of lorem ipsum available
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <FeaturedProductCard
                key={i}
                name={product.name}
                category={product.category}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

        
      {/* Blend Fruits Premium Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-8xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <img
                src={blendjuice}
                alt="Fresh fruits"
                width={692}
                height={526}
                className="blendjuice rounded-lg"
              />
            </div>
            <div className="blendjuice ">
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
                <Button className="bg-[#8CC63F] hover:bg-[#7AB32E] text-white">
                  VIEW MORE
                </Button>
                <Button variant="outline">
                  GO TO SHOP
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Our Products Section */}
      <section className="px-4 py-5 bg-[url('/src/assets//images/Categorys/fullwidth-row-prod-bg-opt.jpg')] bg-cover bg-center bg-no-repeat sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold mb-4 mt-10 font-signika">Our Products</h2>
            <div className="flex justify-center mb-2">
             <img src={categoryTitle} className="w-50"/>
            </div>
            <p className="text-gray-600 text-sm">
              There are many variations of passages of lorem ipsum available
            </p>
          </div>

          <ProductCategorySelector
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <ProductSlider products={products[activeCategory]} />
        </div>
      </section>
        </div>
    )
}

export default ShoppingHome;