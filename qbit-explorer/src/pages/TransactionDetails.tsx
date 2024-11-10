import { Link, useParams } from "react-router-dom";
import { QbitTransaction } from "../types/transaction";
import { GQLNodeInterface } from "ar-gql/dist/faces";
import { useEffect, useState } from "react";
import { dryrunMessage } from "../utils/ao/message";
import { getTags } from "../utils/ao/get-tags";
import argqlClient from "../utils/argqlClient";
import { Transaction } from "@qbit-pay/sdk";
import { FadeLoader } from "react-spinners";


const TransactionDetails = () => {
  const { id } = useParams();
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<QbitTransaction | null>(null);
  const [transferTx, setTransferTx] = useState<GQLNodeInterface | null>(null);
  const [fetching, setFetching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [id]);

  async function fetchDetails(id: string) {
    setFetching(true);

    setNotFound(false);
    try {
      const { Messages } = await dryrunMessage({
        tags: getTags({
          Action: "Get-Transaction",
          "QBit-Id": id,
        }),
      });
      const msg = Messages[0];

      if (!msg) {
        setNotFound(true);
      } else {
        const msgParsed = JSON.parse(msg.Data);
        setTransaction(msgParsed);
        await fetchTransferTx(msgParsed.transferTxn);
        await fetchQrImage(msgParsed);
      }
      // @ts-nocheck
    } catch (e) {
      console.log(e);
      setNotFound(true);
    }
    setFetching(false);
  }

  async function fetchTransferTx(id: string) {
    const transferTx = await argqlClient.tx(id);
    setTransferTx(transferTx);
  }

  async function fetchQrImage(txn: QbitTransaction) {
    if (!txn) {
      return;
    }
    const rawTxn = new Transaction(
      "qbit",
      txn.recipient,
      txn.amount,
      txn.tokenPID,
      txn.qbitId
    );
    const qrImage = await rawTxn.toQrCode();
    setQrImage(qrImage);
  }

  function handleAoLink() {
    window.open(
      `https://ao.link/#/message/${transaction?.transferTxn}`,
      "_blank"
    );
  }

  if (fetching) {
    return (
      <div className="container mx-auto p-4 flex flex-col justify-center items-center min-h-screen w-screen">
        <FadeLoader color="#fff" />
      </div>
    );
  }

  if (notFound || !transaction) {
    return (
      <div className="container mx-auto p-4 flex flex-col justify-center items-center min-h-screen w-screen">
        <h1 className="text-2xl font-medium mb-2 text-white">
          Transaction Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center min-h-full">
      <div className="mt-10 mb-20 text-gray-300">
        <Link to="/" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/app" className="hover:text-white">
          Transactions
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">Details</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* First Row */}
        <div className="p-[2px] bg-gradient-to-r from-[#bde8ff] via-[#97c3f0] to-[#a6b2ff] rounded-lg">
          <div className="card-gradient p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-2 text-[#000720]">
              Total Amount
            </h3>
            <p className="text-[#000720] font-semibold">
              {transaction.amount}qAR
            </p>
          </div>
        </div>
        <div className="p-[2px] bg-gradient-to-r from-[#bde8ff] via-[#97c3f0] to-[#a6b2ff] rounded-lg">
          <div className="card-gradient p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-2 text-[#000720]">Sent To</h3>
            <p className="text-[#000720] font-semibold">
              {transaction.recipient}
            </p>
          </div>
        </div>

        <div className="p-[2px] bg-gradient-to-r from-[#bde8ff] via-[#97c3f0] to-[#a6b2ff] rounded-lg">
          <div className="card-gradient p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-2 text-[#000720]">
              Date and Time
            </h3>
            {transferTx?.block?.timestamp ? (
              <p className="text-[#000720] font-semibold">
                {new Date(transferTx.block.timestamp * 1000).toLocaleString()}
              </p>
            ) : (
              <p className="text-[#000720] font-semibold">No date available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Second Row */}
        <div className="p-[2px] bg-gradient-to-r from-[#bde8ff] via-[#97c3f0] to-[#a6b2ff] rounded-lg">
          <div className="card-gradient p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-2 text-[#000720]">Memo</h3>
            <p className="text-[#000720] font-semibold">-</p>
          </div>
        </div>

        <div className="p-[2px] bg-gradient-to-r from-[#bde8ff] via-[#97c3f0] to-[#a6b2ff] rounded-lg">
          <div className="card-gradient p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-2 text-[#000720]">
              Transaction Status
            </h3>
            <p className="text-[#000720] font-semibold capitalize">
              Successful
            </p>
          </div>
        </div>
      </div>
      <div className="flex mt-10 flex-col items-center">
        <h1 className="text-2xl font-medium mb-2 text-white">QR Used</h1>
        {qrImage && <img src={qrImage} alt="QR Code" />}
      </div>
      <div className="mt-10 flex justify-center">
        <div
          onClick={handleAoLink}
          className="text-gray-200 text-lg hover:bg-[#172651] bg-[#111C3B] px-4 py-2 rounded-md cursor-pointer"
        >
          View on Ao.Link
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
