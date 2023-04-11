import { Component, Inject, Input } from '@angular/core';
import {
  BASE_PATH,
  ClientMinimum,
  ClientsService,
  Configuration,
  InstructorsService,
  ScheduleRecord
} from "src/ApiModule";
import { FormControl } from "@angular/forms";
import { AuthService } from "../../../../auth/auth.service";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-modal-element',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [
    {
      provide: Configuration,
      useFactory: () => new Configuration(
        {
          credentials: { OAuth2PasswordBearer : <string>localStorage.getItem("accessToken")},
        }
      ),
    },
  ]
})
export class ModalComponent {
  @Input()
  record!: ScheduleRecord
  registration_opens_at?: Date
  begins!: Date
  ends!: Date
  photo_url?: string
  clientControl = new FormControl<string | ClientMinimum>('');
  selected_client?: ClientMinimum
  clients!: Observable<ClientMinimum[]>
  authorized!: Boolean
  booking_opened!: Boolean

  constructor(
    @Inject(BASE_PATH) private basePath: string,
    private instructor_service: InstructorsService,
    private client_service: ClientsService,
    private auth_service: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnChanges() {
    this.booking_opened = true
    if (this.record.registration_opens_at) {
      this.registration_opens_at = new Date(this.record.registration_opens_at)
      this.booking_opened = new Date() > this.registration_opens_at
    }
    this.photo_url = undefined
    this.begins = new Date(this.record.date)
    this.ends = new Date(this.begins)
    this.ends.setMinutes(this.ends.getMinutes() + this.record.duration)

    this.instructor_service.getInstructorImage(this.record.program.instructor.id).subscribe({
      next: (instructor) => {
        if (instructor.photo_src)
          this.photo_url = `${this.basePath}/${instructor.photo_src}`
      }
    })

    this.clientControl.valueChanges.subscribe((client) => {
      if (typeof client != 'string')
        this.selected_client = client as ClientMinimum
      else this.selected_client = undefined
    })
  }

  ngOnInit() {
    this.authorized = this.auth_service.isLoggedIn
    if (this.authorized) this.getClientList()
  }

  getClientList() {
    this.clients = this.client_service.getClients()
  }

  resetClientControl() {
    this.clientControl.setValue('')
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
          this.resetClientControl()
        }},
      error: (err: HttpErrorResponse) => {
        let msg = err.message
        if (err.status == 409)
          msg = err.error.detail
        this.openSnackBar(msg)
      }
    })
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Закрыть', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000
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
}
