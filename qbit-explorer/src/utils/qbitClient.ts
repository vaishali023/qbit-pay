import QbitPaySDK from "@qbit-pay/sdk";
import arweaveClient from "./arweaveClient";

const client = QbitPaySDK.init(arweaveClient);

export default client;
