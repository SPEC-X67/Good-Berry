// dummyData.js

export const dummyOrders = [
    {
      id: "ORD-001",
      customerName: "John Doe",
      orderDate: "2025-01-10",
      status: "pending",
      totalAmount: 249.99,
      address: "123 Main St, New York, NY 10001",
      paymentMethod: "Credit Card",
      items: [
        { id: "ITEM-1", name: "Gaming Mouse", quantity: 1, price: 79.99, status: "pending" },
        { id: "ITEM-2", name: "Mechanical Keyboard", quantity: 1, price: 169.99, status: "pending" }
      ]
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      orderDate: "2025-01-09",
      status: "shipped",
      totalAmount: 599.99,
      address: "456 Oak Ave, Los Angeles, CA 90001",
      paymentMethod: "PayPal",
      items: [
        { id: "ITEM-3", name: "4K Monitor", quantity: 1, price: 599.99, status: "shipped" }
      ]
    },
    {
      id: "ORD-003",
      customerName: "Bob Wilson",
      orderDate: "2025-01-08",
      status: "delivered",
      totalAmount: 159.97,
      address: "789 Pine Rd, Chicago, IL 60601",
      paymentMethod: "Debit Card",
      items: [
        { id: "ITEM-4", name: "Wireless Mouse", quantity: 2, price: 49.99, status: "delivered" },
        { id: "ITEM-5", name: "Mouse Pad", quantity: 1, price: 59.99, status: "delivered" }
      ]
    },
    {
      id: "ORD-004",
      customerName: "Alice Johnson",
      orderDate: "2025-01-07",
      status: "processing",
      totalAmount: 1299.97,
      address: "321 Elm St, Houston, TX 77001",
      paymentMethod: "Credit Card",
      items: [
        { id: "ITEM-6", name: "Gaming Laptop", quantity: 1, price: 1199.99, status: "processing" },
        { id: "ITEM-7", name: "Laptop Cooling Pad", quantity: 1, price: 99.98, status: "processing" }
      ]
    },
    {
      id: "ORD-005",
      customerName: "Charlie Brown",
      orderDate: "2025-01-06",
      status: "canceled",
      totalAmount: 449.98,
      address: "654 Maple Dr, Seattle, WA 98101",
      paymentMethod: "PayPal",
      items: [
        { id: "ITEM-8", name: "Gaming Headset", quantity: 1, price: 249.99, status: "canceled", cancelMessage: "Customer requested cancellation" },
        { id: "ITEM-9", name: "Gaming Chair", quantity: 1, price: 199.99, status: "canceled", cancelMessage: "Out of stock" }
      ]
    },
    {
      id: "ORD-006",
      customerName: "Emily Davis",
      orderDate: "2025-01-05",
      status: "delivered",
      totalAmount: 889.97,
      address: "987 Cedar Ln, Miami, FL 33101",
      paymentMethod: "Credit Card",
      items: [
        { id: "ITEM-10", name: "Graphics Card", quantity: 1, price: 699.99, status: "delivered" },
        { id: "ITEM-11", name: "Power Supply", quantity: 1, price: 189.98, status: "delivered" }
      ]
    },
    {
      id: "ORD-007",
      customerName: "David Miller",
      orderDate: "2025-01-04",
      status: "processing",
      totalAmount: 1799.98,
      address: "147 Birch St, Boston, MA 02101",
      paymentMethod: "Debit Card",
      items: [
        { id: "ITEM-12", name: "Gaming Desktop", quantity: 1, price: 1599.99, status: "processing" },
        { id: "ITEM-13", name: "Gaming Monitor", quantity: 1, price: 199.99, status: "processing" }
      ]
    },
    {
      id: "ORD-008",
      customerName: "Sarah Wilson",
      orderDate: "2025-01-03",
      status: "shipped",
      totalAmount: 349.97,
      address: "258 Willow Way, Denver, CO 80201",
      paymentMethod: "PayPal",
      items: [
        { id: "ITEM-14", name: "Wireless Keyboard", quantity: 1, price: 149.99, status: "shipped" },
        { id: "ITEM-15", name: "Mouse and Keyboard Set", quantity: 1, price: 199.98, status: "shipped" }
      ]
    }
  ];
  
  // Mock API functions
  export const fetchOrders = () => {
    return Promise.resolve(dummyOrders);
  };
  
  export const updateOrderItem = (orderId, itemId, updates) => {
    const updatedOrders = dummyOrders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        return { ...order, items: updatedItems };
      }
      return order;
    });
    return Promise.resolve(updatedOrders.find(order => order.id === orderId));
  };