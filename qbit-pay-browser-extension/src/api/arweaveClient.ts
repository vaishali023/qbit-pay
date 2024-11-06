import Arweave from "arweave"

const arweave = Arweave.init({
  host: "arweave-search.goldsky.com",
  port: 443,
  protocol: "https"
})

export default arweave
