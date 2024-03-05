import { AddressLike, Provider, Wallet, ethers } from 'ethers';

class WalletManager {
    _wallet: Wallet;
    _provider: Provider;
    constructor(pk: string, rpc: string){
        this._provider = new ethers.JsonRpcProvider(rpc);
        this._wallet = new ethers.Wallet(pk , this._provider);
    }

    public async send_to(address: AddressLike , amount: string): Promise<string>{
        const transac_amount    = ethers.parseEther(amount);
        const current_balance   = await this.check_balance();
        
        if(transac_amount > current_balance) throw Error(`Balance to low !`);

        console.log(`Current Balance : ${current_balance.toString()}`);
        const transaction = await this._wallet.sendTransaction({
            to: address,
            value: ethers.parseEther(amount),
            gasPrice: await this.getGas()
        });
        console.log(`Hash : ${transaction.hash}`);
        await transaction.wait();
        return transaction.hash;
    }
    async check_balance(): Promise<bigint> {
        return await this._provider.getBalance(this._wallet.address)
    }

    async getGas(): Promise<bigint | null> {
        return (await this._provider.getFeeData()).gasPrice
    }

}

export default WalletManager;