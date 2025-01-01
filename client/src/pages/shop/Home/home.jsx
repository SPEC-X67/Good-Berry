import { Button } from "@/components/ui/button";
import heroProduct from "../../../assets/hero/organic-slide-1-img-535x487.png";
import { ProductCategorySelector } from "./ProductCategorySelector";
import { Image } from "lucide-react";
import { useState } from "react";


const products = {
  'ice-cream': [
    { name: "Strawberry Ice Cream", price: "5.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Chocolate Ice Cream", price: "5.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Vanilla Ice Cream", price: "5.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Mint Chip Ice Cream", price: "6.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Mango Sorbet", price: "6.99", imageUrl: "/placeholder.svg?height=200&width=150" },
  ],
  'fruit-tea': [
    { name: "Peach Fruit Tea", price: "3.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Berry Blast Tea", price: "3.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Lemon Ginger Tea", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Apple Cinnamon Tea", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Tropical Fruit Tea", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
  ],
  'jam': [
    { name: "Strawberry Jam", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Raspberry Jam", price: "5.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Blueberry Jam", price: "5.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Apricot Jam", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Mixed Berry Jam", price: "6.99", imageUrl: "/placeholder.svg?height=200&width=150" },
  ],
  'juice': [
    { name: "Orange Juice", price: "3.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Apple Juice", price: "3.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Grape Juice", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Pineapple Juice", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Pomegranate Juice", price: "5.99", imageUrl: "/placeholder.svg?height=200&width=150" },
  ],
  'snacks': [
    { name: "Fruit and Nut Mix", price: "6.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Dried Mango Slices", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Banana Chips", price: "3.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Apple Rings", price: "4.99", imageUrl: "/placeholder.svg?height=200&width=150" },
    { name: "Berry Medley", price: "7.99", imageUrl: "/placeholder.svg?height=200&width=150" },
  ],
}


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

        
      {/* Blend Fruits Premium Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Fresh fruits"
                width={600}
                height={500}
                className="rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Blend fruits premium drink</h2>
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
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
          <ProductCategorySelector
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products[activeCategory].map((product, i) => (
              <div key={i} className="flex flex-col items-center">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={150}
                  height={200}
                  className="mb-4"
                />
                <p className="text-sm text-gray-600 mb-2">{product.name}</p>
                <p className="font-semibold">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
        </div>
    )
}

export default ShoppingHome;