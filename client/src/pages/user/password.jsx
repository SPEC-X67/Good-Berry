import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PasswordPage = () => (
  <Card>
    <CardHeader>
      <CardTitle>Change Password</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Current Password</label>
        <Input type="password" placeholder="Enter current password" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">New Password</label>
        <Input type="password" placeholder="Enter new password" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Confirm Password</label>
        <Input type="password" placeholder="Confirm new password" />
      </div>
      <Button className="w-full">Update Password</Button>
    </CardContent>
  </Card>
);

export default PasswordPage;