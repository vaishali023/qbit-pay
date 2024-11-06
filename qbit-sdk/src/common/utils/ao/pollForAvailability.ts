import Arweave from "arweave/web";
import { waitFor } from "../../utils/waitFor";

export async function pollForTxBeingAvailable({
  txId,
  arweave,
}: {
  txId: string;
  arweave: Arweave;
}): Promise<void> {
  const pollingOptions = {
    maxAttempts: 10,
    pollingIntervalMs: 3_000,
    initialBackoffMs: 7_000,
  };
  const { maxAttempts, pollingIntervalMs, initialBackoffMs } = pollingOptions;

  console.log("Polling for transaction...", { txId });
  await waitFor(initialBackoffMs);

  let attempts = 0;
  while (attempts < maxAttempts) {
    let transaction;
    attempts++;

    try {
      const response = await arweave.api.post("/graphql", {
        query: `
          query {
            transaction(id: "${txId}") {
              recipient
              owner {
                address
              }
              quantity {
                winston
              }
            }
          }
          `,
      });

      transaction = response?.data?.data?.transaction;
    } catch (err) {
      // Continue retries when request errors
      console.log("Failed to poll for transaction...", { err });
    }

    if (transaction) {
      return;
    }
    console.log("Transaction not found...", {
      txId,
      attempts,
      maxAttempts,
      pollingIntervalMs,
    });
    await waitFor(pollingIntervalMs);
  }

  throw new Error(
    "Transaction not found after polling, transaction id: " + txId
  );
}
