import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '@/store/admin-slice/order-slice';

function AdminOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, isLoading, error, currentPage, totalPages } = useSelector((state) => state.adminOrder);
  const searchInputRef = useRef(null);
  
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const loadOrders = useCallback((page = 1) => {
    dispatch(fetchAllOrders({ 
      page, 
      limit: 5, 
      search: debouncedSearch, 
      status: statusFilter,
    }));
  }, [dispatch, debouncedSearch, statusFilter]);

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
    loadOrders(1);
  }, [debouncedSearch, statusFilter, loadOrders]);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handlePageChange = (newPage) => {
    loadOrders(newPage);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'shipped': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'delivered': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'returned': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'failed' : return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const hasReturnRequest = (items) => {
    return items.some(item => item.returnRequest);
  };

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error fetching orders: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Search by Order ID or Customer Name"
              value={searchInput}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {
              isLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center align-middle">
                      <div className="flex justify-center items-center space-x-2 h-[100px]">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">#{order.orderId}</TableCell>
                      <TableCell>{order?.userId?.username || order?.addressId?.name}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {hasReturnRequest(order.items) && (
                          <>
                          <Badge className="bg-yellow-100 mb-1 text-yellow-800 hover:bg-yellow-200">
                            Return rq
                          </Badge>
                          <br />
                          </>
                        )} 
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )
            }
            
          </Table>
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
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
  );
}

export default AdminOrders;