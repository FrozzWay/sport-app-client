import { Component } from '@angular/core';
import { Client, ClientsService } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClientViewModalComponent } from "../client-view.modal/client-view.modal.component";
import { HttpErrorResponse } from "@angular/common/http";
import { FormControl } from "@angular/forms";


@Component({
  selector: 'app-client.modal-element',
  templateUrl: './client.modal.component.html',
  styleUrls: ['../../categories/categories.modal/categories.modal.component.scss', './client.modal.component.scss']
})
export class ClientModalComponent {
  clients!: Client[]
  filtered_clients!: Client[]
  filterControl = new FormControl('')

  constructor(
    private client_service: ClientsService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.client_service.getClients().subscribe((c: any) => {
      this.clients = c
      this.filtered_clients = c
    })
    this.filterControl.valueChanges.subscribe(v => this._filter(v))
  }

  _filter(value: any) {
    if (typeof value != 'string') return
    const filterValue = value.toLowerCase();
    this.filtered_clients = this.clients.filter(client =>
      client.credentials.toLowerCase().includes(filterValue) ||
      client.phone.toLowerCase().includes(filterValue)
    )
  }

  edit_client(client: Client) {
    const modalRef = this.modalService.open(ClientViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m'
    })
    modalRef.componentInstance.client = client
    modalRef.result.then(result => {
      this.client_service.updateClient(client.id, result).subscribe({
        next: result => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          const i = this.clients.indexOf(client)
          this.clients[i] = result;
        },
        error: (error: HttpErrorResponse) => {
           this.snackBar.open(error.error.detail, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
        }})
    })
  }

  create_client() {
    const modalRef = this.modalService.open(ClientViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m'
    })
    modalRef.result.then(result => {
      this.client_service.createClient(result).subscribe({
        next: result => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          this.clients.push(result)
        },
        error: (error: HttpErrorResponse) => {
           this.snackBar.open(error.error.detail, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
        }})
    })
  }

  delete_client(client: Client) {
    this.client_service.deleteClient(client.id).subscribe({
      next: () => {
        this.snackBar.open('Инструктор удален', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
        this.clients = this.clients.filter(i => i != client)
      },
      error: (error: HttpErrorResponse) => {
         this.snackBar.open(`Ошибка: ${error.error.detail}`, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
    }})
  }
}
