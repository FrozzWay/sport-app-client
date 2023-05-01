import { Component, Input } from '@angular/core';
import { periods_ScheduleRecord } from 'src/app/public/models'
import * as utils from "src/time-utils";
import { ScheduleRecord } from "src/ApiModule";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RecordModalComponent } from "../record.modal/record.modal.component";


@Component({
  selector: 'app-shed-table',
  templateUrl: './table-schedule.component.html',
  styleUrls: ['./table-schedule.component.scss']
})
export class TableScheduleComponent {
  @Input() periods!: periods_ScheduleRecord
  @Input() next_week: boolean = false
  dates: Date[] = []

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    utils.add_days(this.dates, this.next_week)
    console.log(this.periods)
  }

  open_modal(record: ScheduleRecord) {
    const modalRef = this.modalService.open(RecordModalComponent, {
      centered: true,
      backdrop: true,
    });
    modalRef.componentInstance.record = record
  }

  today() {
    return utils.today()
  }
}
