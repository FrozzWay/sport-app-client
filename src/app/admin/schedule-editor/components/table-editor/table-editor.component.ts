import { Component, EventEmitter, Input, Output } from '@angular/core';
import { periods_SchemaRecord} from 'src/app/admin/models'
import * as utils from "src/time-utils";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SchemaRecord, Schema } from "src/ApiModule";
import { ViewRecordModalComponent } from "../view-record.modal/view-record.modal.component";


@Component({
  selector: 'app-shed-editor-table',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.scss']
})
export class TableScheduleEditorComponent {
  @Input() periods!: periods_SchemaRecord
  @Input() next_week: boolean = false
  @Input() schema?: Schema
  @Output() onRemoveRecord: EventEmitter<any> = new EventEmitter();
  dates: Date[] = []

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    utils.add_days(this.dates, this.next_week)
  }

  view_record(record: SchemaRecord) {
    const modalRef = this.modalService.open(ViewRecordModalComponent, {
      centered: true,
      backdrop: true,
    });
    modalRef.componentInstance.record = record
    modalRef.componentInstance.schema = this.schema
    modalRef.componentInstance.onRemoveRecord.subscribe((record: SchemaRecord) => {
      this.onRemoveRecord.emit(record)
    })
  }

  today() {
    return utils.today()
  }
}
