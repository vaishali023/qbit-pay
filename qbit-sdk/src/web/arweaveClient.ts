import Arweave from "arweave/web";

const client = Arweave.init({
  host: "arweave-search.goldsky.com",
  port: 443,
  protocol: "https",
});

export default client;
