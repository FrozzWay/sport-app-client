import { Component, Input } from '@angular/core';
import { ClientReportRow, Program } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProgramViewModalComponent } from "../../programs/program-view.modal/program-view.modal.component";

@Component({
  selector: 'app-client-report-view.modal-element',
  templateUrl: './client-report-view.modal.component.html',
  styleUrls: ['./client-report-view.modal.component.scss']
})
export class ClientReportViewModalComponent {
  @Input() report!: ClientReportRow[];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {}

  date(str: string): Date {
    return new Date(str)
  }

  view_program(program: Program) {
    const modalRef = this.modalService.open(ProgramViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m',
      backdropClass: 'tiny-backdrop'
    })
    modalRef.componentInstance.program = program
    modalRef.componentInstance.hideAction = true
  }
}
