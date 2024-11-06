import { ConnectButton } from "arweave-wallet-kit";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-[#2f2d31] text-white flex items-center justify-between px-8 py-4 shadow-lg z-20">
      <h1
        className="text-2xl font-semibold ml-4"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        Marketplace
      </h1>
      <ConnectButton
        accent="rgb(171 154 255)"
        profileModal={true}
        showBalance={true}
      />
      {/* <Connect /> */}
    </div>
  );
};

export default Header;
