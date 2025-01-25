import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, CreditCard, Activity, IndianRupee } from "lucide-react"
import { useMemo, useState } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

// Dummy data generator function
function generateData(type) {
  const data = []
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentDay = now.getDate()

  if (type === "yearly") {
    for (let i = 0; i < 5; i++) {
      data.push({
        name: `${currentYear - 4 + i}`,
        total: Math.floor(Math.random() * 50000) + 10000,
      })
    }
  } else if (type === "monthly") {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for (let i = 0; i < 12; i++) {
      data.push({
        name: monthNames[i],
        total: Math.floor(Math.random() * 5000) + 1000,
      })
    }
  } else {
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentYear, currentMonth, currentDay - 6 + i)
      data.push({
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        total: Math.floor(Math.random() * 1000) + 100,
      })
    }
  }

  return data
}

// Dummy data for Recent Sales
const recentSalesData = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    sale: "₹1,999.00",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    sale: "₹39.00",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    sale: "₹299.00",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    sale: "₹99.00",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    sale: "₹39.00",
  },
]

// Dummy data for top 10 products
const top10ProductsData = [
  { name: "Product A", sales: 1200 },
  { name: "Product B", sales: 980 },
  { name: "Product C", sales: 850 },
  { name: "Product D", sales: 780 },
  { name: "Product E", sales: 720 },
  { name: "Product F", sales: 650 },
  { name: "Product G", sales: 590 },
  { name: "Product H", sales: 520 },
  { name: "Product I", sales: 460 },
  { name: "Product J", sales: 400 },
]

// Dummy data for top 10 categories
const top10CategoriesData = [
  { name: "Electronics", sales: 5200 },
  { name: "Clothing", sales: 4800 },
  { name: "Home & Garden", sales: 3900 },
  { name: "Sports", sales: 3200 },
  { name: "Books", sales: 2800 },
  { name: "Beauty", sales: 2500 },
  { name: "Toys", sales: 2200 },
  { name: "Automotive", sales: 1900 },
  { name: "Jewelry", sales: 1600 },
  { name: "Food", sales: 1400 },
]

function Overview() {
  const [timeRange, setTimeRange] = useState("monthly")
  const data = useMemo(() => generateData(timeRange), [timeRange])

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select onValueChange={(value) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="total" stroke="#adfa1d" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function RecentSales() {
  return (
    <div className="space-y-8">
      {recentSalesData.map((sale, index) => (
        <div key={index} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {sale.sale}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Top10Products() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={top10ProductsData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="sales" stroke="#adfa1d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function Top10Categories() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={top10CategoriesData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pl-4 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
       <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231.89</div>
            <p className="text-xs text-emerald-600">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-blue-600">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-purple-600">+19% from last month</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-orange-600">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Top10Products />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Top10Categories />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

