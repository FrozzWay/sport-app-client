import { Component, EventEmitter, Output } from '@angular/core';
import { Program, ProgramsService } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProgramViewModalComponent } from "../program-view.modal/program-view.modal.component";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-program.modal-delete',
  templateUrl: './program.modal.component.html',
  styleUrls: ['../../categories/categories.modal/categories.modal.component.scss', './program.modal.component.scss']
})
export class ProgramModalComponent {
  programs!: Program[]
  @Output() onDelete = new EventEmitter();

  constructor(
    private programs_service: ProgramsService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.programs_service.getAllPrograms().subscribe((p) => this.programs = p)
  }

  view_program(program: Program) {
    const modalRef = this.modalService.open(ProgramViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m'
    })
    modalRef.componentInstance.program = program
    modalRef.result.then((result: Program) => {
      this.programs_service.deleteProgram(result.id).subscribe({
        next: () => {
          this.snackBar.open('Программа удалена', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
          this.programs = this.programs.filter(i => i != program)
          this.onDelete.emit()
        },
        error: (error: HttpErrorResponse) => {
           this.snackBar.open(`Ошибка: ${error.error.detail}`, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
      }})
    })
  }
}
