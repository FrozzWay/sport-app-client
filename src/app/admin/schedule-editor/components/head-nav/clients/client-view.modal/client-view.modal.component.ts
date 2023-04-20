import { Component, Input } from '@angular/core';
import { Client, CreateClient } from "src/ApiModule";
import { FormControl } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-client-view.modal-element',
  templateUrl: './client-view.modal.component.html',
  styleUrls: ['./client-view.modal.component.scss']
})
export class ClientViewModalComponent {
  @Input() client!: Client
  credentials = new FormControl('');
  phone = new FormControl('');
  phone_mask = {
    mask: '+{7} (000) 000-00-00'
  }
  msg!: string

  constructor(public activeDialog: NgbActiveModal) {}

  ngOnInit() {
    if (this.client) {
      this.credentials.setValue(this.client.credentials)
      this.phone.setValue(this.client.phone)
      this.msg = 'Редактирование клиента'
    } else this.msg = 'Создание клиента'
  }

  save() {
    let client: CreateClient = {
      phone: this.phone.value!,
      credentials: this.credentials.value!
    }
    this.activeDialog.close(client)
  }

}
