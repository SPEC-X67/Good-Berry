import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AccountDetailPage = () => (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input placeholder="Enter full name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="Enter email" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <Input placeholder="Enter phone number" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <Input type="date" />
        </div>
        <Button className="w-full">Update Profile</Button>
      </CardContent>
    </Card>
  );

  export default AccountDetailPage