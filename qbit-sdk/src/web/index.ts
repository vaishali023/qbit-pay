import QbitPaySDK from "../common";
import arweaveClient from "./arweaveClient";

const sdk = QbitPaySDK.init(arweaveClient);

export * from "../common";
export default sdk;
