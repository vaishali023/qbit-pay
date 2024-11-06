import { QbitTransaction } from "../types/transaction";
import { useNavigate } from "react-router-dom";
import argqlClient from "../utils/argqlClient";
import { useEffect, useState } from "react";
import { GQLNodeInterface } from "ar-gql/dist/faces";
interface TransactionCardProps {
  transaction: QbitTransaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const navigate = useNavigate();
  const [transferTx, setTransferTx] = useState<GQLNodeInterface | null>(null);

  useEffect(() => {
    fetchTransaction();
  }, [transaction]);

  async function fetchTransaction() {
    if (!transaction.transferTxn) {
      return;
    }
    const transferTx = await argqlClient.tx(transaction.transferTxn);
    setTransferTx(transferTx);
  }

  if (!transaction) {
    return null;
  }

  return (
    <div
      onClick={() => navigate(`/app/transactions/${transaction.qbitId}`)}
      className="p-4 mb-2 border border-transparent rounded-lg cursor-pointer hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-600/10 transition-all"
    >
      <div className="flex justify-between items-center">
        <span className="text-white">{transaction.recipient}</span>
        <span className="text-white">
          <span className="font-bold">{transaction.amount}</span> qAR
        </span>{" "}
      </div>
      <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
        {transferTx?.block && (
          <span>
            {new Date(transferTx?.block.timestamp*1000).toLocaleDateString()}
          </span>
        )}
        <span
          className={`px-2 py-1 rounded bg-green-500 text-green-100 shadow-[0px_0px_4px_1px_rgba(72,191,145,0.6)]`}
        >
          {"Completed"}
        </span>
      </div>
    </div>
  );
};

export default TransactionCard;
