import { getTags } from "../utils/ao/get-tags";
import { dryrunMessage, sendMessage } from "../utils/ao/message";
import { v4 as uuidv4 } from "uuid";
import * as QRCode from "qrcode";
import { pollForTransferCheck } from "../utils/ao/pollForTransferCheck";

export class Transaction {
  qbitId: string;
  protocol: string;
  recipient: string;
  amount: string;
  tokenPID: string;

  constructor(
    protocol: string,
    recipient: string,
    amount: string,
    tokenPID: string,
    qbitId: string = uuidv4()
  ) {
    this.protocol = protocol;
    this.recipient = recipient;
    this.amount = amount;
    this.tokenPID = tokenPID;
    this.qbitId = qbitId;
  }

  static fromUrl(url: string) {
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol.replace(":", "");

      if (protocol !== "qbit") {
        throw new Error("Invalid protocol");
      }

      const recipient = parsedUrl.pathname; // Remove leading slash
      const qbitId = parsedUrl.searchParams.get("qbitId") || "";
      const amount = parsedUrl.searchParams.get("amount") || "0";
      const tokenPID = parsedUrl.searchParams.get("tokenPID") || "";

      return new Transaction(protocol, recipient, amount, tokenPID, qbitId);
    } catch (error) {
      throw new Error("Invalid QBit URL format");
    }
  }

  toUrl() {
    return `qbit:${this.recipient}?amount=${this.amount}&tokenPID=${this.tokenPID}&qbitId=${this.qbitId}`;
  }

  async toQrCode() {
    try {
      const paymentRequestUrl = this.toUrl();
      const qrCodeDataURL = await QRCode.toDataURL(paymentRequestUrl);

      return qrCodeDataURL;
    } catch (error) {
      throw new Error(
        "Failed to generate QR code: " + (error as Error).message
      );
    }
  }

  async makePayment() {
    // @ts-ignore
    if (!window.arweaveWallet) {
      throw new Error("Arweave Wallet not found");
    }

    const dryRunArgs = {
      tags: getTags({
        Action: "Info",
      }),
      pid: this.tokenPID,
    };

    const { Messages } = await dryrunMessage(dryRunArgs);

    if (!Messages || Messages.length === 0) {
      throw new Error("No messages returned from dryrunMessage");
    }

    const denominationTag = Messages[0].Tags.find(
      (tag: any) => tag.name === "Denomination"
    );

    if (!denominationTag) {
      throw new Error("Denomination tag not found");
    }

    const denomination = parseInt(denominationTag.value);
    const amount = parseFloat(this.amount) * 10 ** denomination;

    const args = {
      tags: getTags({
        Action: "Transfer",
        Recipient: this.recipient,
        Quantity: amount.toString(),
        QbitId: this.qbitId,
      }),
      pid: this.tokenPID,
    };

    const msgId = await sendMessage(args);

    if (!msgId) {
      throw new Error("Failed to send message");
    }

    return msgId;
  }

  async pollForTransferStatus() {
    return await pollForTransferCheck({
      qbitId: this.qbitId,
      maxRequests: 1000,
    });
  }
}
