import { Transaction } from "@qbit-pay/sdk";
import React, { useState } from "react";
import { FadeLoader } from "react-spinners";

interface Modalprops {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const ModalQRCode: React.FC<Modalprops> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const [qrCodeImage, setQrCodeImage] = useState<string>(
    "https://via.placeholder.com/150"
  );
  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(true);

  React.useEffect(() => {
    transaction.toQrCode().then((qrCode) => {
      setQrCodeImage(qrCode);
    });
  }, [transaction]);

  React.useEffect(() => {
    if (!transaction) return;

    transaction.pollForTransferStatus().then(() => {
      setIsTransactionPending(false);
    });
  }, [transaction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      {/* Overlay for dimming background */}
      <div
        className="absolute inset-0 bg-black opacity-75"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative z-10 bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600"
        >
          ✕
        </button>
        <img
          src={qrCodeImage || ""}
          alt="QR Code"
          className="w-68 h-68 object-cover mx-auto p-10"
        />
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-center">
            Amount to Pay: {transaction.amount} qAR
          </p>
          {isTransactionPending && (
            <div className="min-h-[200px] flex flex-col gap-2 items-center justify-center w-full">
              <FadeLoader color="#36d7b7" />
              <p className="text-lg font-semibold text-center">
                Transaction is pending...
              </p>
            </div>
          )}
          {!isTransactionPending && (
            <div className="min-h-[200px] flex flex-col gap-2 items-center justify-center w-full">
              <p className="text-lg font-semibold text-center">
                Transaction is completed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalQRCode;
