import { waitFor } from "../../utils/waitFor";
import { arGql, GQLUrls } from "ar-gql";

const goldsky = arGql({ endpointUrl: GQLUrls.goldsky });

const prepareTransactionsQueryObject = () => {
  return {
    query: `
     query($cursor: String, $qbitId: [String!]) {
      transactions(
        first: 100
        after: $cursor
        tags: [
          { name: "Action", values: ["Create-Transaction"] }
          { name: "QBit-Id", values: $qbitId }
        ]
      ) {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            ...TransactionCommon
          }
        }
      }
    }
    fragment TransactionCommon on Transaction {
      id
      ingested_at
      recipient
      block {
        height
        timestamp
      }
      tags {
        name
        value
      }
    }
    `,
  };
};

export async function pollForTransferCheck({
  qbitId,
  maxRequests = 10,
}: {
  qbitId: string;
  maxRequests?: number;
}): Promise<void> {
  const pollingOptions = {
    maxAttempts: maxRequests,
    pollingIntervalMs: 3_000,
    initialBackoffMs: 7_000,
  };
  const { maxAttempts, pollingIntervalMs, initialBackoffMs } = pollingOptions;

  console.log("Polling for transaction...", { qbitId });
  await waitFor(initialBackoffMs);

  let attempts = 0;
  while (attempts < maxAttempts) {
    let transaction;
    attempts++;

    try {
      const queryObject = prepareTransactionsQueryObject();
      const edges = await goldsky.all(queryObject.query, {
        qbitId,
      });

      transaction = edges[0]?.node;
    } catch (err) {
      // Continue retries when request errors
      console.log("Failed to poll for transaction...", { err });
    }

    if (transaction) {
      return;
    }
    console.log("Transaction not found...", {
      qbitId,
      attempts,
      maxAttempts,
      pollingIntervalMs,
    });
    await waitFor(pollingIntervalMs);
  }

  throw new Error(
    "Transaction not found after polling, transaction id: " + qbitId
  );
}
