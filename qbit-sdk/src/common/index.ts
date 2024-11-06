import ArweaveWeb from "arweave/web";
import ArweaveNode from "arweave/node";
import { Transaction } from "./payment/Transaction";

export default class QbitPaySDK {
  arweaveClient: ArweaveWeb | ArweaveNode;

  constructor(client: ArweaveWeb | ArweaveNode) {
    this.arweaveClient = client;
  }

  static init(arweaveClient: ArweaveWeb | ArweaveNode) {
    return new QbitPaySDK(arweaveClient);
  }

  createTransaction(txn: CreateTransactionOptions) {
    return new Transaction(
      txn.protocol,
      txn.recipient,
      txn.amount,
      txn.tokenPID
    );
  }
}

export type CreateTransactionOptions = {
  protocol: string;
  recipient: string;
  amount: string;
  tokenPID: string;
};

export * from "./storage/aoProcess";
export * from "./payment/Transaction";
