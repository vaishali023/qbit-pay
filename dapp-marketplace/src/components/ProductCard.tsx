import React from "react";
import { Product } from "../../data/products";

interface ProductCardProps {
  product: Product;
  onBuyNow: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
  return (
    <div className="product-card border rounded-lg shadow-lg border-gray-200 p-4 pb-6 bg-white transition-transform transform hover:scale-105">
      {/* Set a fixed width and height for the image to ensure consistency */}
      <img
        src={product.image}
        alt={product.name}
        className="w-[400px] h-[500px] object-cover rounded-md mx-auto"
      />
      <h3 className="mt-4 text-xl font-semibold text-center text-gray-700">
        {product.name}
      </h3>
      <button
        onClick={onBuyNow}
        className="text-white px-8 py-3 rounded-lg mt-4  hover:bg-[#2f2d31] hover:shadow-lg w-full bg-[#3c3b3f]"
      >
        Buy now for {product.price.toFixed(4)} qAR
      </button>
    </div>
  );
};

export default ProductCard;
