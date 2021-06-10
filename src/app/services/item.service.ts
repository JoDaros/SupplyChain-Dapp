import {Injectable} from '@angular/core';
import Web3 from 'web3';

declare let require: any;
declare let window: any;
const ItemManagerContract = require('../../../truffle/build/contracts/ItemManager.json');
const ItemContract = require('../../../truffle/build/contracts/Item.json');

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private web3: any;
  public itemManager: any;
  public item: any;
  private accounts: string[];
  private networkId: number;
  private enable: Promise<any>;

  constructor() {
    this.init().then(res => {
    }).catch(err => {
      console.error(err);
    });
  }

  private async init(): Promise<void> {

    console.log('Staring web3');
    await this.loadWeb3();
    console.log('Finished web3');
    this.accounts = await this.web3.eth.getAccounts();
    this.networkId = await this.web3.eth.net.getId();

    this.itemManager = new this.web3.eth.Contract(
      ItemManagerContract.abi,
      ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
    );
    this.item = new this.web3.eth.Contract(
      ItemContract.abi,
      ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
    );
    this.listenToPayment();
  }

  private async loadWeb3(): Promise<void> {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.enable;
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
    }
    console.log('Finished loadWeb3');
  }

  private listenToPayment(): void {
    const self = this;
    this.itemManager.events.SupplyChainStep().on('data', async evt => {
      if (+evt.returnValues._step === 1) {
        const item = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
        alert('Item ' + item._identifier + ' was paid, deliver it now!');
      }
    });
  }

  public getAccounts(): string[] {
    return this.accounts.slice();
  }

  public getWeb3(): any {
    return this.web3;
  }
}
