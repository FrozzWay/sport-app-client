import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScheduleSchemasService, Schema, SchemaRecord } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { this_mo } from "src/time-utils";

@Component({
  selector: 'app-view-record.modal-element',
  templateUrl: './view-record.modal.component.html',
  styleUrls: ['./view-record.modal.component.scss']
})
export class ViewRecordModalComponent {
  @Input() record!: SchemaRecord
  @Input() schema!: Schema
  @Output() onRemoveRecord: EventEmitter<SchemaRecord> = new EventEmitter();
  monday = this_mo()
  begins!: Date
  ends!: Date

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private schema_service: ScheduleSchemasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    document.getElementById('program-desc')!.classList.remove('opacity-50')
    this.begins = new Date(this.monday.setDate(this.monday.getDate() + this.record.week_day))
    this.begins.setHours(+this.record.day_time.split(':')[0])
    this.begins.setMinutes(+this.record.day_time.split(':')[1])
    this.ends = new Date(this.begins)
    this.ends.setMinutes(this.ends.getMinutes() + this.record.duration)
  }

  removeRecord() {
    const confirmRef = this.modalService.open(ConfirmationDialog, {
      centered: true,
      size: 'sm'
    })
    confirmRef.result.then(() => {
      this.schema_service.excludeRecordsFromSchema(this.schema.id, [this.record.id])
        .subscribe(() => {
          this.snackBar.open('Запись удалена', 'Закрыть', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000
          })
          this.onRemoveRecord.emit(this.record)
          this.activeModal.close()
      })
    })
  }
}


@Component({
  selector: 'dialog-animations-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialog {
  constructor(public activeDialog: NgbActiveModal,) {}
}
