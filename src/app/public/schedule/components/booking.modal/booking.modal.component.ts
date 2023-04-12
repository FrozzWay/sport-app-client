import { Component, Input } from '@angular/core';
import { ClientsService, ScheduleRecord, ClientMinimum } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { RecordModalComponent } from "../record.modal/record.modal.component";


@Component({
  selector: 'app-booking.modal-element',
  templateUrl: './booking.modal.component.html',
  styleUrls: ['./booking.modal.component.scss']
})
export class BookingModalComponent {
  @Input() record!: ScheduleRecord
  clientControl = new FormControl<string | ClientMinimum>('');
  selected_client?: ClientMinimum
  clients!: Observable<ClientMinimum[]>

  constructor(
    private client_service: ClientsService,
    private snackBar: MatSnackBar,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.getClientList()
    this.clientControl.valueChanges.subscribe((client) => {
      if (typeof client != 'string')
        this.selected_client = client as ClientMinimum
      else this.selected_client = undefined
    })
  }

  getClientList() {
    this.clients = this.client_service.getClients()
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Закрыть', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000
    })
  }

  isSelectedClient() {
    return Boolean(this.selected_client)
  }

  book_client() {
    this.client_service.bookClient(
      this.selected_client!.id, this.record.program.id,
      this.record.date, 'response'
    ).subscribe({
      next: (response) => {
        if (response.status == 204) {
          this.openSnackBar('Клиент успешно записан')
          if (this.record.places_available! > 0)
            this.record.places_available!--
        }},
      error: (err: HttpErrorResponse) => {
        let msg = err.message
        if (err.status == 409)
          msg = err.error.detail
        this.openSnackBar(msg)
      }
    })
  }

  unbook_client() {
    this.client_service.removeClientBooking(
      this.selected_client!.id, this.record.program.id,
      this.record.date, 'response'
    ).subscribe({
      next: (response) => {
        if (response.status == 204) {
          if (this.record.places_available! != undefined)
            this.record.places_available!++
          this.openSnackBar('Запись отменена')
        }
      },
      error: (err: HttpErrorResponse) => {
        let msg = err.message
        if (err.status == 404)
          msg = 'Клиент не был записан на занятие'
        this.openSnackBar(msg)
      }
    })
  }

  open_record_modal() {
    this.activeModal.close()
    const modalRef = this.modalService.open(RecordModalComponent, {
      centered: true
    })
    modalRef.componentInstance.record = this.record
  }

}
