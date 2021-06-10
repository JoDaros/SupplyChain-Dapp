import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemService} from './services/item.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loading = false;
  formSubmitted = false;
  userForm: FormGroup;
  item: { identifier: string, cost: number };

  constructor(private fb: FormBuilder, private itemService: ItemService) {
  }

  ngOnInit(): void {
    this.formSubmitted = false;
    this.item = {identifier: '', cost: null};
    this.createForms();
  }

  createForms(): void {
    this.userForm = this.fb.group({
      itemName: new FormControl(this.item.identifier, Validators.compose([
        Validators.required,
      ])),
      cost: new FormControl(this.item.cost, Validators.compose([
        Validators.required,
        Validators.pattern('^[+]?([.]\\d+|\\d+[.]?\\d*)$')
      ]))
    });
  }


  submitForm(): void {
    this.loading = true;
    this.createItem(this.itemService.getAccounts()[0]).then((res => {
      this.loading = false;
    }));
  }

  async createItem(account: string): Promise<any> {
    const result = await this.itemService.itemManager.methods
      .createItem(
        this.userForm.value.itemName,
        this.itemService.getWeb3().utils.toWei(this.userForm.value.cost, 'ether'))
      .send({from: account});
    console.log(result);
    alert('Send ' + this.userForm.value.cost + ' Ether to ' + result.events.SupplyChainStep.returnValues._itemAddress);
  }
}
