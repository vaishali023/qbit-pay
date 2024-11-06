import { QbitTransaction } from "../types/transaction";
import TransactionCard from "../components/TransactionCard";
import DashboardStats from "../components/DashboardStats";
import { useEffect, useState } from "react";
import { getTags } from "../utils/ao/get-tags";
import { dryrunMessage } from "../utils/ao/message";

const TransactionList = () => {

  const [transactions, setTransactions] = useState<QbitTransaction[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    handleFetchTransactions();
  }, []);

  async function handleFetchTransactions() {
    setFetching(true);

    try {
      const { Messages } = await dryrunMessage({
        tags: getTags({
          Action: "Get-All-Transactions",
        }),
      });
      const msg = Messages[0];

      if (!msg) {
        return;
      } else {
        const msgParsed = JSON.parse(msg.Data);
        const data = Object.values(msgParsed);
        setTransactions(data as QbitTransaction[]);
      }
      // @ts-nocheck
    } catch (e) {
      console.log(e);
    }
    setFetching(false);
  }
  console.log(fetching);
  const pendingTransactions: QbitTransaction[] = [];
  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="flex flex-col justify-center min-h-[calc(60vh-100px)]">
        <DashboardStats
          totalTransactions={transactions.length}
          pendingTransactions={pendingTransactions.length}
          successfulTransactions={transactions.length}
          failedTransactions={0}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 border border-[#DCDCDC] rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-white">
            All Transactions
          </h2>
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.qbitId}
                transaction={transaction}
              />
            ))}
          </div>
        </div>
        <div className="p-6 border border-[#DCDCDC] rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-white">
            Pending Transactions
          </h2>
          <div className="space-y-2">
            {pendingTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.qbitId}
                transaction={transaction}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
