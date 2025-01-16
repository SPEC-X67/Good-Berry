import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserStatus } from '@/store/admin-slice';
import { useToast } from '@/hooks/use-toast';


export default function CustomersPage() {
  const dispatch = useDispatch();
  const { users, isLoading, totalPages, currentPage } = useSelector(state => state.admin);  
  const searchInputRef = useRef(null);
  const { toast } = useToast();
  
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [itemsPerPage] = useState(6);

  const loadUsers = useCallback((page = 1) => {
    dispatch(fetchUsers({ 
      page, 
      limit: itemsPerPage, 
      search: debouncedSearch 
    }));
  }, [dispatch, debouncedSearch, itemsPerPage]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    loadUsers(1);
  }, [debouncedSearch, loadUsers]);

  const handleBlockUnblock = (userId, currentStatus) => {
    const isBlocked = !currentStatus; 
    dispatch(updateUserStatus({ id: userId, isBlocked })).then(() => {
      toast({ title: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
    }).catch(() => {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    });
  };

  const handlePageChange = (newPage) => {
    loadUsers(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;  
  }

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-sm pb-5">
        <div className="p-2 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl font-semibold">Customers</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search customers..."
                value={searchInput}
                onChange={handleSearch}
                className="pl-8 pr-4 py-2 w-full"
              />
            </div>
          </div>
        </div>
        <div className="border rounded-lg mx-2 md:mx-4" style={{ minHeight: '450px', height: '450px', overflowY: 'auto' }}>
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
                {users.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell className="font-medium">{customer.username}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || "Not Added"}</TableCell>
                    <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{customer.orders || "NILL"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${customer.isBlocked ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {customer.isBlocked ? 'Blocked' : 'Active'}
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
                             onClick={() => handleBlockUnblock(customer._id, customer.isBlocked)}
                             className={customer.isBlocked ? 'text-green-500' : 'text-red-500'}
                         >
                             {customer.isBlocked ? 'Unblock' : 'Block'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-blue-600"
                          >
                            View Details
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
      {totalPages > 1 && (
      <div >
      <Button
      variant="outline"
      size="sm"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      >
      <ChevronLeft className="h-4 w-4" />
      Previous
      </Button>
      <span className="text-sm font-medium">
      Page {currentPage} of {totalPages}
      </span>
      <Button
      variant="outline"
      size="sm"
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      >
      Next
      <ChevronRight className="h-4 w-4" />
      </Button>
      </div>
      )}
      </div>
    </div>
  );
}
