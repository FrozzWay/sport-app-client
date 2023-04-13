import { Component, Input } from '@angular/core';
import { periods_SchemaRecord} from 'src/app/admin/models'
import * as utils from "src/time-utils";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SchemaRecord, Schema } from "src/ApiModule";


@Component({
  selector: 'app-shed-editor-table',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.scss']
})
export class TableScheduleEditorComponent {
  @Input() periods!: periods_SchemaRecord
  @Input() next_week: boolean = false
  @Input() schema?: Schema
  dates: Date[] = []

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    utils.add_days(this.dates, this.next_week)
  }

  open_modal(record: SchemaRecord) {
    // const modalRef = this.modalService.open(RecordModalComponent, {
    //   centered: true,
    //   backdrop: true,
    // });
    // modalRef.componentInstance.record = record
  }

  today() {
    return utils.today()
  }
}
