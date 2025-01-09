import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const WalletPage = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹2,450.00</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, type: 'Credit', amount: '+₹500', date: 'Jan 3, 2024' },
              { id: 2, type: 'Debit', amount: '-₹120', date: 'Jan 2, 2024' },
              { id: 3, type: 'Credit', amount: '+₹1000', date: 'Jan 1, 2024' },
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Clock className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">{transaction.type}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <span className={transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  export default WalletPage;