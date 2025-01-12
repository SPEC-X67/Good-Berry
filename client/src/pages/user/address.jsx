import { useState } from 'react'
import { Plus, Pencil, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ShippingAddress() {
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(null)
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      street: '2118 Thornridge Cir',
      city: 'Syracuse',
      state: 'Connecticut',
      zip: '35624',
      country: 'United States',
      name: 'Thornridge',
      type: 'HOME',
      mobile: '9656633324'
    }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newAddress = {
      id: isEditing || Date.now().toString(),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      country: formData.get('country'),
      name: formData.get('name'),
      type: formData.get('type'),
      mobile: formData.get('mobile'),
    }

    if (isEditing) {
      setAddresses(addresses.map(addr => addr.id === isEditing ? newAddress : addr))
      setIsEditing(null)
    } else {
      setAddresses([...addresses, newAddress])
    }
    setShowForm(false)
  }

  const handleEdit = (address) => {
    setIsEditing(address.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
  }

  const editingAddress = isEditing ? addresses.find(addr => addr.id === isEditing) : null

  return (
    <div className="w-full space-y-6 p-5">
      <Card className="lg:px-6 px-4">
        <CardHeader className="px-0 flex-row justify-between items-center">
          <h2 className="text-lg font-medium">Shipping Address</h2>
          {!showForm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary hover:text-primary-foreground"
              onClick={() => {
                setShowForm(true)
                setIsEditing(null)
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-0">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-600">Street Address</Label>
                <Input 
                  name="street" 
                  defaultValue={editingAddress?.street} 
                  className="mt-1" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">City</Label>
                  <Input 
                    name="city" 
                    defaultValue={editingAddress?.city} 
                    className="mt-1" 
                    required 
                  />
                </div>
                <div>
                  <Label className="text-gray-600">State</Label>
                  <Input 
                    name="state" 
                    defaultValue={editingAddress?.state} 
                    className="mt-1" 
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Zip Code</Label>
                  <Input 
                    name="zip" 
                    defaultValue={editingAddress?.zip} 
                    className="mt-1" 
                    required 
                  />
                </div>
                <div>
                  <Label className="text-gray-600">Country</Label>
                  <Input 
                    name="country" 
                    defaultValue={editingAddress?.country} 
                    className="mt-1" 
                    required 
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-600">Name</Label>
                <Input 
                  name="name" 
                  defaultValue={editingAddress?.name} 
                  className="mt-1" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Type</Label>
                  <Input 
                    name="type" 
                    defaultValue={editingAddress?.type} 
                    className="mt-1" 
                    required 
                  />
                </div>
                <div>
                  <Label className="text-gray-600">Mobile</Label>
                  <Input 
                    name="mobile" 
                    defaultValue={editingAddress?.mobile} 
                    className="mt-1" 
                    required 
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-primary hover:bg-green-700">
                  {isEditing ? 'Update Address' : 'Add Address'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false)
                    setIsEditing(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <RadioGroup defaultValue={addresses[0]?.id} className="space-y-4">
              {addresses.map((address) => (
                <Card key={address.id} className="bg-gray-50 border-0">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.name}</span>
                          <span className="px-2 py-0.5 text-xs bg-primary text-white rounded">
                            {address.type}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {`${address.street}, ${address.city}, ${address.state} ${address.zip}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(address)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(address.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
