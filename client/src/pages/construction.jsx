import { Construction } from "lucide-react"
import { Link } from "react-router-dom"

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center mt-12 p-4">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <Construction className="w-24 h-24 text-[#92c949] mx-auto animate-bounce" />
        <h1 className="text-4xl font-bold text-green-800">Under Construction</h1>
        <p className="text-xl text-green-700">
          We&apos;re working hard to bring you something amazing. Please check back soon!
        </p>
        <Link
          href="/"
          className="inline-block bg-[#92c949] hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Return to Home
        </Link>
      </div> 
    </div>
  )
}
