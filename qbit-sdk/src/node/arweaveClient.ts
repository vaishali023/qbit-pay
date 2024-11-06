import Arweave from "arweave/node";

const client = Arweave.init({
  host: "arweave-search.goldsky.com",
  port: 443,
  protocol: "https",
});

export default client;
