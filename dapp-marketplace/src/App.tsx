import "./index.css";
import Layout from "./components/Layout";
import { sampleProducts } from "../data/products";
import Header from "./components/Header";
import { ArweaveWalletKit } from "arweave-wallet-kit";
function App() {
  // Memoized callback to add products to the cart, avoiding unnecessary re-renders
  // const handleAddToCart = useCallback((product: Product) => {
  //   setCartItems((prevItems) => [...prevItems, product]);  // Adds the selected product to the cart
  // }, []);

  return (
    <>
      <ArweaveWalletKit
        config={{
          permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
          ensurePermissions: true,
        }}
        theme={{
          accent: { r: 171, g: 154, b: 255 },
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <Header />
          <Layout products={sampleProducts} />
        </div>
      </ArweaveWalletKit>
    </>
  );
}

export default App;
