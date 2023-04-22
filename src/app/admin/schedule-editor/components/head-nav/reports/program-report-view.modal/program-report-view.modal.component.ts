import { Component, Input } from '@angular/core';
import { ProgramsReportResponse } from "src/ApiModule";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-program-report-view.modal-element',
  templateUrl: './program-report-view.modal.component.html',
  styleUrls: ['./program-report-view.modal.component.scss']
})
export class ProgramReportViewModalComponent {
  @Input() report!: ProgramsReportResponse

  constructor(public activeModal: NgbActiveModal) {}

  date(str: string): Date {
    return new Date(str)
  }
}
