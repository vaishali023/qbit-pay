import { AoProcessStorage, Transaction } from "@qbit-pay/sdk"

import arweave from "./arweaveClient"

// Helper function to wait for window.arweaveWallet to be available
const storage = new AoProcessStorage(
  arweave as any,
  "HckUwzu2OvjLCEHYxxCCx3O5HSuUAVO2BTpVsLECVFY"
)
window.addEventListener("message", async (message) => {
  const data = message.data
  if (data && data.type === "QR_CODE_DATA") {
    const transaction = Transaction.fromUrl(data.data)
    console.log("Received QR data in main world:", transaction)

    const txid = await transaction.makePayment()
    debugger
    await storage.saveTransaction(txid, transaction)
    console.log("Transaction ID:", txid)

    // const arweaveWallet = await waitForArweaveWallet()
    // @ts-ignore
    window.postMessage(
      {
        type: "QBIT_SCAN_TOGGLE",
        state: false
      },
      "*"
    )
  }
})

export {}
