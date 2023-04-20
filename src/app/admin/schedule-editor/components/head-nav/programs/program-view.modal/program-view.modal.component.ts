import { Component, Input } from '@angular/core';
import { Program } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ConfirmationDialogComponent
} from "../../../../../../reusable components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-program-view.modal-delete',
  templateUrl: './program-view.modal.component.html',
  styleUrls: ['./program-view.modal.component.scss']
})
export class ProgramViewModalComponent {
  @Input() program!: Program
  @Input() hideAction?: boolean

  constructor(public activeDialog: NgbActiveModal, private modalService: NgbModal) {}

  delete() {
    const confirmRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      size: 'sm'
    })
    confirmRef.componentInstance.header = 'Удаление программы'
    confirmRef.componentInstance.message = 'Записи расписания, содержащие эту программу, будут удалены из всех схем расписания вместе с информацией о записавшихся клиентах. Это действие невозможно отменить.'
    confirmRef.result.then(() => this.activeDialog.close(this.program))
  }

  ngAfterViewInit() {
    document.getElementById('program-desc')!.classList.remove('opacity-50')
  }
}
