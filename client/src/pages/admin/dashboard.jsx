import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchDashboardData } from "@/store/admin-slice"
import { Users, CreditCard, Activity, IndianRupee } from "lucide-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

function Overview() {
  const dispatch = useDispatch()
  const {  
    overviewData,
    status
  } = useSelector((state) => state.admin.data)
  
  
  const handleTimeRangeChange = (value) => {
    dispatch(fetchDashboardData(value))
  }

  if (status === 'loading') {
    return <div >Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select onValueChange={handleTimeRangeChange}>
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
        <LineChart data={overviewData}>
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
  const { recentSales } = useSelector((state) => state.admin.data)

  return (
    <div className="space-y-8">
      {recentSales.map((sale, index) => (
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
  const { top10Products } = useSelector((state) => state.admin.data)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={top10Products}>
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
  const { top10Categories } = useSelector((state) => state.admin.data)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={top10Categories}>
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
  const dispatch = useDispatch()
  const { 
    totalRevenue, 
    newCustomers, 
    totalSales, 
    activeUsers 
  } = useSelector((state) => state.admin.data)
  const status = useSelector((state) => state.admin.status)
  const error = useSelector((state) => state.admin.error)

  useEffect(() => {
    dispatch(fetchDashboardData('weekly'))
  }, [dispatch])

  if (status === 'loading') {
    return <div>Loading dashboard data...</div>
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pl-4 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalRevenue.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-emerald-600">
              {totalRevenue.change > 0 ? '+' : ''}{totalRevenue.change}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{newCustomers.value.toLocaleString()}</div>
            <p className="text-xs text-blue-600">
              {newCustomers.change > 0 ? '+' : ''}{newCustomers.change}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales.value.toLocaleString()}</div>
            <p className="text-xs text-purple-600">
              {totalSales.change > 0 ? '+' : ''}{totalSales.change}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeUsers.value.toLocaleString()}</div>
            <p className="text-xs text-orange-600">
              {activeUsers.change > 0 ? '+' : ''}{activeUsers.change} since last hour
            </p>
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

