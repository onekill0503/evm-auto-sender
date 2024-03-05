import { AddressLike, Wallet, ethers } from 'ethers'
import env from 'dotenv'
import WalletManager from './src/utils/wallet';
import EVMConstructorParam from './src/models/EVMContrustorParam';
env.config();

class EVMAutoSender {
    _senderWallet: WalletManager;
    _delay: number = 0;
    _listTarget: AddressLike[];
    _amount: string;
    _randomTarget: boolean;
    _randomAmount: boolean;

    constructor(param: EVMConstructorParam){
        this._senderWallet = new WalletManager(param.privateKey , param.rpc);
        this._listTarget = param.listTarget ?? [];
        this._delay = param.delay ?? 15000;
        this._randomTarget = param.randomTarget;
        this._randomAmount = param.randomAmount;
        this._amount = param.amount ?? "0.00000001";
    }

    async send(stop: boolean = false){
        if(stop) return;
        if(this._randomTarget) await this.sendRandom();
        else if ( !this._randomTarget && this._listTarget.length > 0) await this.sendList(this._listTarget);
    }
    
    async sendRandom(){
        const newWallet = ethers.Wallet.createRandom();
        const hash = await this._senderWallet.send_to(newWallet.address , this._amount);
        console.log(`Successfully send ${this._amount} transaction with hash ${hash}`);
        return this.send();
    }
    
    async sendList(listAddress: AddressLike[] = []){
        for(const address of listAddress){
            const hash = await this._senderWallet.send_to(address , this._amount);
            console.log(`Successfully send ${this._amount} transaction with hash ${hash}`);
        }
        return this.send(true);
    }
}

export default EVMAutoSender;