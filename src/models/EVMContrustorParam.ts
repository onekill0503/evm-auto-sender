import { AddressLike } from "ethers";

type EVMConstructorParam  = {
    privateKey: string;
    listTarget?: AddressLike[];
    delay?: number;
    randomTarget: boolean;
    randomAmount?: boolean;
    amount?: string;
    rpc: string;
}

export default EVMConstructorParam;