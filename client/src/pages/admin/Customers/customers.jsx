import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '@/store/admin-slice'

export default function CustomersPage() {

  const dispatch = useDispatch();
  const {users} = useSelector(state => state.admin)
  console.log(users)
  
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    
    const filtered = users.filter(customer => 
      customer.username.toLowerCase().includes(term) || 
      customer.email.toLowerCase().includes(term) 
    )
    setCustomers(filtered)
  }

  const handleStatusChange = (customerId) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        const newStatus = customer.isBlock === true ? 'BLock' : 'Unblock'
        return { ...customer, status: newStatus }
      }
      return customer
    }))
  }

  const handleDelete = (customerId) => {
    setCustomers(customers.filter(customer => customer.id !== customerId))
  }

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-2 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl font-semibold">Customers</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8 pr-4 py-2 w-full"
              />
            </div>
          </div>
        </div>
        <div className="border rounded-lg mx-2 md:mx-4 mb-4" style={{ height: '600px', overflowY: 'auto' }}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        customer.status === 'Active' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {customer.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(customer.id)}
                            className={customer.status === 'Active' ? 'text-red-600' : 'text-green-600'}
                          >
                            {customer.status === 'Active' ? 'Block' : 'Unblock'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
