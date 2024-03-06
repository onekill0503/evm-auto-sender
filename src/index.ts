import { AddressLike, ethers } from 'ethers'
import WalletManager from './utils/wallet';
import EVMConstructorParam from './models/EVMContrustorParam';
import ora, { Ora } from 'ora';
import { arrowSpinner } from './utils/spinner';
import { generateRandomDecimalInRange } from './utils/random';
import { Big } from 'big.js'
import { Delay } from './utils/time';

class EVMAutoSender {
    _senderWallet: WalletManager;
    _delay: number = 0;
    _listTarget: AddressLike[];
    _amount: string;
    _randomTarget: boolean;
    _randomAmount: boolean;
    _minAmount?: string;
    _maxAmount?: string;
    _spinner: Ora = ora({ spinner: arrowSpinner });

    constructor(param: EVMConstructorParam){
        this._senderWallet = new WalletManager(param.privateKey , param.rpc);
        this._listTarget = param.listTarget ?? [];
        this._delay = param.delay ?? 15000;
        this._randomTarget = param.randomTarget;
        this._randomAmount = param.randomAmount ?? false;
        this._amount = param.amount ?? "0.00000001";
        this._minAmount = param.minAmount;
        this._maxAmount = param.maxAmount;
    }

    async send(): Promise<boolean>{
        if(this._randomTarget) return await this.sendRandom();
        else if ( !this._randomTarget && this._listTarget.length > 0) return await this.sendList(this._listTarget);
        return false;
    }
    
    async sendRandom(): Promise<boolean>{
        const newWallet = ethers.Wallet.createRandom();
        this._spinner.text = `Sending to wallet : ${newWallet.address}`;
        const amount = this.getAmount();
        const hash = await this._senderWallet.send_to(newWallet.address , amount);
        this._spinner.succeed(`Successfully sent ${amount} transaction with hash ${hash}`);
        await Delay(this._delay);
        return true;
    }
    
    async sendList(listAddress: AddressLike[] = []): Promise<boolean>{
        for(const address of listAddress){
            this._spinner.text = `Sending to wallet : ${address}`;
            const amount = this.getAmount();
            const hash = await this._senderWallet.send_to(address , amount);
            this._spinner.succeed(`Successfully sent ${amount} transaction with hash ${hash}`);
        }
        await Delay(this._delay);
        return false;
    }

    getAmount(): string {
        if(this._randomAmount) return generateRandomDecimalInRange(new Big(this._minAmount ?? "0.00002") , new Big(this._maxAmount ?? "0.00001"))
        else return this._amount;
    }

    public async start(): Promise<void> {
        let running: boolean = true;
        this._spinner.start();
        do {
            try{    
                running = await this.send();
                this._spinner = ora({ spinner: arrowSpinner }).start();
            }catch(error: any){
                this._spinner.fail(error.message);
            }
        }while(running);
    }
}

export default EVMAutoSender;