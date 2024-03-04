import env from 'dotenv'
import { ethers } from 'ethers';

env.config();

export default new ethers.JsonRpcProvider(process.env.RPC);