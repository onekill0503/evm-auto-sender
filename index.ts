import { ethers } from 'ethers'
import env from 'dotenv'
import WalletManager from './src/utils/wallet';
env.config();

(async () => {
    const walletManager = new WalletManager(process.env.PK ?? ``);
    const newWallet = ethers.Wallet.createRandom();
    console.log(`New Wallet is : ${newWallet.address}`)
    const hash = await walletManager.send_to(newWallet.address , '0.0000001');
    console.log(`Successfully send transaction with hash ${hash}`);
})()