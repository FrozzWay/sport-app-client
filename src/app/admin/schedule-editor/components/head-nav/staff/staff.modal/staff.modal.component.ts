import { Component } from '@angular/core';
import { AuthService, Staff, StaffCreate } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { StaffViewModalComponent } from "../staff-view.modal/staff-view.modal.component";

@Component({
  selector: 'app-staff.modal-element',
  templateUrl: './staff.modal.component.html',
  styleUrls: ['../../categories/categories.modal/categories.modal.component.scss', './staff.modal.component.scss']
})
export class StaffModalComponent {
  staff!: Staff[]

  constructor(
    private staff_service: AuthService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.staff_service.getAllStaff().subscribe(s => {
      this.staff = s.filter(s => s.role != 1) // exclude admins
    })
  }

  view_staff(staff: Staff) {
    const modalRef = this.modalService.open(StaffViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m'
    })
    modalRef.componentInstance.staff = staff
    modalRef.result.then((staff: Staff) => {
      this.delete_staff(staff)
    })
  }

  create_staff() {
    const modalRef = this.modalService.open(StaffViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m'
    })
    modalRef.result.then((staff: StaffCreate) => {
      this.staff_service.signUp(staff).subscribe({
        next: result => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          this.staff.push(result)
        },
        error: (error: HttpErrorResponse) => {
           this.snackBar.open(error.error.detail, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
        }})
    })
  }

  delete_staff(staff: Staff) {
    this.staff_service.deleteStaff(staff.id).subscribe({
      next: () => {
        this.snackBar.open('Инструктор удален', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
        this.staff = this.staff.filter(s => s != staff)
      },
      error: (error: HttpErrorResponse) => {
         this.snackBar.open(`Ошибка: ${error.error.detail}`, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
    }})
  }
}
