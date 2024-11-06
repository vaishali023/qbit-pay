import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "../../data/products";
import QbitPaySDK, { Transaction } from "@qbit-pay/sdk";
import Arweave from "arweave/web";
import ModalQRCode from "./ModalQRCode";

interface LayoutProps {
  products: Product[];
}

const arweave = Arweave.init({
  host: "arweave-search.goldsky.com",
  port: 443,
  protocol: "https",
});

const Layout: React.FC<LayoutProps> = ({ products }) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const qbitClient = QbitPaySDK.init(arweave);

  const handleBuyNow = async (product: Product) => {
    const txn = qbitClient.createTransaction({
      amount: product.price.toString(),
      recipient: "a_YwuG7Xmaec1VOCrrg3P8FK9Tw7Tbw4DaylAcKvN4g",
      protocol: "qbit",
      tokenPID: "NG-0lVX882MG5nhARrSzyprEK6ejonHpdUmaaMPsHE8",
    });

    setTransaction(txn);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTransaction(null);
  };

  return (
    <div className="min-h-screen  py-16 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyNow={() => handleBuyNow(product)}
          />
        ))}
      </div>

      {transaction && (
        <ModalQRCode
          isOpen={isModalOpen}
          onClose={closeModal}
          transaction={transaction}
        />
      )}
    </div>
  );
};

export default Layout;
