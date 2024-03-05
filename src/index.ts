import { AddressLike, ethers } from 'ethers'
import WalletManager from './utils/wallet';
import EVMConstructorParam from './models/EVMContrustorParam';
import ora, { Ora } from 'ora';
import { arrowSpinner } from './utils/spinner';

class EVMAutoSender {
    _senderWallet: WalletManager;
    _delay: number = 0;
    _listTarget: AddressLike[];
    _amount: string;
    _randomTarget: boolean;
    _randomAmount: boolean;
    _spinner: Ora = ora({ spinner: arrowSpinner });

    constructor(param: EVMConstructorParam){
        this._senderWallet = new WalletManager(param.privateKey , param.rpc);
        this._listTarget = param.listTarget ?? [];
        this._delay = param.delay ?? 15000;
        this._randomTarget = param.randomTarget;
        this._randomAmount = param.randomAmount ?? false;
        this._amount = param.amount ?? "0.00000001";
    }

    async send(): Promise<boolean>{
        if(this._randomTarget) return await this.sendRandom();
        else if ( !this._randomTarget && this._listTarget.length > 0) return await this.sendList(this._listTarget);
        return false;
    }
    
    async sendRandom(): Promise<boolean>{
        const newWallet = ethers.Wallet.createRandom();
        this._spinner.text = `Sending to wallet : ${newWallet.address}`;
        const hash = await this._senderWallet.send_to(newWallet.address , this._amount);
        this._spinner.succeed(`Successfully sent ${this._amount} transaction with hash ${hash}`);
        return true;
    }
    
    async sendList(listAddress: AddressLike[] = []): Promise<boolean>{
        for(const address of listAddress){
            this._spinner.text = `Sending to wallet : ${address}`;
            const hash = await this._senderWallet.send_to(address , this._amount);
            this._spinner.succeed(`Successfully sent ${this._amount} transaction with hash ${hash}`);
        }
        return false;
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