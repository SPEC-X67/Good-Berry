import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AddressPage = () => (
  <Card>
    <CardHeader>
      <CardTitle>Shipping Address</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <Input placeholder="Enter first name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <Input placeholder="Enter last name" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Street Address</label>
        <Input placeholder="Enter street address" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <Input placeholder="Enter city" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <Input placeholder="Enter state" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code</label>
          <Input placeholder="Enter ZIP code" />
        </div>
      </div>
      <Button className="w-full">Save Address</Button>
    </CardContent>
  </Card>
);

export default AddressPage;