import ArweaveClient from "arweave/web";
import { Transaction } from "../payment/Transaction";
import { getTags } from "../utils/ao/get-tags";
import { dryrunMessage, sendMessage } from "../utils/ao/message";
import { pollForTxBeingAvailable } from "../utils/ao/pollForAvailability";
import { QBIT_PROCESS_ID } from "../utils/constants";

export class AoProcessStorage {
  private arweaveClient: ArweaveClient;
  processId: string;
  constructor(
    arweaveClient: ArweaveClient,
    processId: string = QBIT_PROCESS_ID
  ) {
    this.arweaveClient = arweaveClient;
    this.processId = processId;
  }

  getAllTransactions = async () => {
    const { Messages } = await dryrunMessage({
      tags: getTags({
        pid: this.processId,
        Action: "Get-All-Transactions",
      }),
    });

    if (!Messages || !Messages[0]) {
      throw new Error("No transactions found");
    }

    const parsedData = JSON.parse(Messages[0].data);

    return Object.values(parsedData);
  };

  getTransactionById = async (id: string) => {
    const { Messages } = await dryrunMessage({
      tags: getTags({
        pid: this.processId,
        Action: "Get-Transaction",
        "QBit-Id": id,
      }),
    });

    if (!Messages || !Messages[0]) {
      throw new Error("No transactions found");
    }

    const parsedData = JSON.parse(Messages[0].data);

    return parsedData;
  };

  saveTransaction = async (txid: string, transaction: Transaction) => {
    const msgId = await sendMessage({
      tags: getTags({
        Action: "Create-Transaction",
        "QBit-Id": transaction.qbitId,
        Amount: transaction.amount,
        "Token-PID": transaction.tokenPID,
        Recipient: transaction.recipient,
        "Transfer-Txn": txid,
      }),
    });

    await pollForTxBeingAvailable({ txId: txid, arweave: this.arweaveClient });

    return msgId;
  };
}
