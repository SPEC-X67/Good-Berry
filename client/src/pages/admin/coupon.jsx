"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dummy data
const initialCoupons = [
  { id: "CPN250118003", code: "SUMMER10", discount: 10, startDate: "2023-06-01", endDate: "2023-08-31", usageLimit: 100, minimumAmount: 50, used: 45, status: "active" },
  { id: "CPN250118002", code: "WELCOME20", discount: 20, startDate: "2023-01-01", endDate: "2023-12-31", usageLimit: 500, minimumAmount: 100, used: 230, status: "active" },
  { id: "CPN250118001", code: "FLASH50", discount: 50, startDate: "2023-07-15", endDate: "2023-07-16", usageLimit: 50, minimumAmount: 200, used: 50, status: "expired" },
]

export default function CouponManagement() {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)

  const handleAddCoupon = (newCoupon) => {
    setCoupons([...coupons, { ...newCoupon, id: `CPN${Date.now()}`, used: 0 }])
    setIsDialogOpen(false)
  }

  const handleEditCoupon = (editedCoupon) => {
    setCoupons(coupons.map(coupon => coupon.id === editedCoupon.id ? editedCoupon : coupon))
    setIsDialogOpen(false)
    setEditingCoupon(null)
  }

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter(coupon => coupon.id !== id))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search by Coupon ID or Code" 
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCoupon(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
              </DialogHeader>
              <CouponForm 
                onSubmit={editingCoupon ? handleEditCoupon : handleAddCoupon} 
                initialData={editingCoupon} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              <div className="md:col-span-2">
                <div className="font-medium text-sm text-gray-500">Coupon ID</div>
                <div className="font-medium">{coupon.id}</div>
                <div className="mt-2">
                  <div className="font-medium text-sm text-gray-500">Code</div>
                  <div>{coupon.code}</div>
                </div>
              </div>
              <div>
                <div className="font-medium text-sm text-gray-500">Discount</div>
                <div>${coupon.discount.toFixed(2)}</div>
              </div>
              <div>
                <div className="font-medium text-sm text-gray-500">Usage</div>
                <div>{coupon.used} / {coupon.usageLimit}</div>
              </div>
              <div>
                <div className="font-medium text-sm text-gray-500">Status</div>
                <Badge 
                  variant={
                    coupon.status === 'active' ? 'success' : 
                    coupon.status === 'expired' ? 'destructive' : 'secondary'
                  }
                  className="mt-1"
                >
                  {coupon.status}
                </Badge>
              </div>
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingCoupon(coupon)
                        setIsDialogOpen(true)
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <div className="text-sm text-gray-500">Page 1 of 1</div>
        <Button variant="outline" disabled>
          Next
        </Button>
      </div>
    </div>
  )
}

function CouponForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    code: "",
    discount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    minimumAmount: "",
    status: "active"
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="code">Coupon Code</Label>
        <Input id="code" name="code" value={formData.code} onChange={handleChange} required className="mt-1" />
      </div>
      <div className="flex gap-3 w-full">
      <div className="w-full">
        <Label htmlFor="discount">Discount Amount ($)</Label>
        <Input id="discount" name="discount" type="number" step="0.01" value={formData.discount} onChange={handleChange} required className="mt-1" />
      </div>
      <div className="w-full">
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>
      <div className="flex gap-3 w-full">
        <div className="w-full">
        <Label htmlFor="startDate">Start Date</Label>
        <DatePicker 
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
        />
        </div>
        <div className="w-full">
        <Label htmlFor="endDate">End Date</Label>
        <DatePicker 
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
        />
        </div>
      </div>
      <div className="flex gap-3 w-full">
      <div className="w-full">
        <Label htmlFor="usageLimit">Usage Limit</Label>
        <Input id="usageLimit" name="usageLimit" type="number" value={formData.usageLimit} onChange={handleChange} required className="mt-1" />
      </div>
      <div className="w-full">
        <Label htmlFor="minimumAmount">Minimum Amount ($)</Label>
        <Input id="minimumAmount" name="minimumAmount" type="number" step="0.01" value={formData.minimumAmount} onChange={handleChange} required className="mt-1" />
      </div>
      </div>
      <Button type="submit" className="w-full">{initialData ? "Update Coupon" : "Add Coupon"}</Button>
    </form>
  )
}

