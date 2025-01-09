import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const OrdersPage = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Order #1234', 'Order #1235', 'Order #1236'].map((order) => (
                <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Package className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-medium">{order}</p>
                      <p className="text-sm text-gray-500">Placed on Jan 3, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  export default OrdersPage