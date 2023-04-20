import { Component, EventEmitter, Output } from '@angular/core';
import { Instructor, InstructorPublic, InstructorsService } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { InstructorViewModalComponent } from "../instructor-view.modal/instructor-view.modal.component";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-instructor.modal-element',
  templateUrl: './instructor.modal.component.html',
  styleUrls: ['../../categories/categories.modal/categories.modal.component.scss', './instructor.modal.component.scss']
})
export class InstructorModalComponent {
  instructors!: Instructor[]
  @Output() onUpdate = new EventEmitter();
  instructor_to_upload?: Instructor

  constructor(
    private instructor_service: InstructorsService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.instructor_service.getInstructors().subscribe(i => this.instructors = i)
  }

  edit_instructor(instructor: Instructor) {
    const modalRef = this.modalService.open(InstructorViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m'
    })
    modalRef.componentInstance.instructor = instructor
    modalRef.result.then(result => {
      this.instructor_service.updateInstructor(instructor.id, result).subscribe({
        next: result => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          const i = this.instructors.indexOf(instructor)
          this.instructors[i] = result;
          this.onUpdate.emit()
        },
        error: (error: HttpErrorResponse) => {
           this.snackBar.open(error.error.detail, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
        }})
    })
  }

  create_instructor() {
    const modalRef = this.modalService.open(InstructorViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m'
    })
    modalRef.result.then(result => {
      this.instructor_service.createInstructor(result).subscribe({
        next: result => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          this.instructors.push(result)
        },
        error: (error: HttpErrorResponse) => {
           this.snackBar.open(error.error.detail, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
        }})
    })
  }

  delete_instructor(instructor: Instructor) {
    this.instructor_service.deleteInstructor(instructor.id).subscribe({
      next: () => {
        this.snackBar.open('Инструктор удален', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
        this.instructors = this.instructors.filter(i => i != instructor)
        this.onUpdate.emit()
      },
      error: (error: HttpErrorResponse) => {
         this.snackBar.open(`Ошибка: ${error.error.detail}`, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
    }})
  }

  upload_photo(instructor: Instructor) {
    this.instructor_to_upload = instructor
    document.getElementById('file_upload')!.click()
  }

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files![0];
    if (file.type.split('/')[0] != 'image') {
      this.snackBar.open('Ошибка: файл должен быть изображением', 'Закрыть', {duration: 5000, verticalPosition: 'top'})
      return
    }
    this.instructor_service.uploadInstructorImage(this.instructor_to_upload!.id, file).subscribe({
      next: (instructor: InstructorPublic) => {
        this.snackBar.open('Фото добавлено', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
        const i = this.instructors.indexOf(this.instructor_to_upload!)
        this.instructors[i].photo_src = instructor.photo_src
      },
      error: (error: HttpErrorResponse) => {
         this.snackBar.open(`Ошибка: ${error.error.detail}`, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
    }})
  }
}
