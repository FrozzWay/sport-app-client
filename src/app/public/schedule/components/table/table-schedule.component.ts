import { Component, Input, EventEmitter, Output } from '@angular/core';
import {periods} from 'src/app/public/models'
import * as utils from "../../../../../time-utils";
import { ScheduleRecord } from "../../../../../ApiModule";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RecordModalComponent} from "../record.modal/record.modal.component";
import { BookingModalComponent } from "../booking.modal/booking.modal.component";

@Component({
  selector: 'app-shed-table',
  templateUrl: './table-schedule.component.html',
  styleUrls: ['./table-schedule.component.scss']
})
export class TableScheduleComponent {
  @Input()
  periods!: periods
  @Input()
  next_week: boolean = false
  dates!: Date[]

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.add_days()
  }

  add_days() {
    this.dates = []
    for (let day = 0; day < 7; day++) {
      let date = (!this.next_week) ? utils.this_mo() : utils.next_mo()
      date.setDate(date.getDate() + day)
      this.dates.push(date)
    }
  }

  today(): number {
    let date = new Date()
    date.setHours(0,0,0,0);
    return date.getTime()
  }

  open_modal(record: ScheduleRecord) {
    const modalRef = this.modalService.open(RecordModalComponent, {
      centered: true,
      backdrop: true,
    });
    modalRef.componentInstance.record = record
  }
}
