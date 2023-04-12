import { Component, Inject, Input } from '@angular/core';
import {
  BASE_PATH,
  InstructorsService,
  ScheduleRecord
} from "src/ApiModule";
import { AuthService } from "../../../../auth/auth.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BookingModalComponent } from "../booking.modal/booking.modal.component";

@Component({
  selector: 'app-record.modal-element',
  templateUrl: './record.modal.component.html',
  styleUrls: ['./record.modal.component.scss'],
})
export class RecordModalComponent {
  @Input() record!: ScheduleRecord
  registration_opens_at?: Date
  begins!: Date
  ends!: Date
  photo_url?: string
  authorized!: Boolean
  booking_opened: Boolean = true

  constructor(
    @Inject(BASE_PATH) private basePath: string,
    private instructor_service: InstructorsService,
    private auth_service: AuthService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.authorized = this.auth_service.isLoggedIn
    this.begins = new Date(this.record.date)
    this.ends = new Date(this.begins)
    this.ends.setMinutes(this.ends.getMinutes() + this.record.duration)

    if (this.record.registration_opens_at) {
      this.registration_opens_at = new Date(this.record.registration_opens_at)
      this.booking_opened = new Date() > this.registration_opens_at
    }
    if (this.begins < new Date()) this.booking_opened = false

    this.instructor_service.getInstructorImage(this.record.program.instructor.id).subscribe({
      next: (instructor) => {
        if (instructor.photo_src)
          this.photo_url = `${this.basePath}/${instructor.photo_src}`
      }
    })
  }

  open_modal_booking() {
    this.activeModal.close()
    const modalRef = this.modalService.open(BookingModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.record = this.record
  }
}
