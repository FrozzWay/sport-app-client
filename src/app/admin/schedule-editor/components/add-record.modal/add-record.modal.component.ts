import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Schema } from "src/ApiModule";
import { FormControl } from "@angular/forms";
import * as utils from "src/time-utils";

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.modal.component.html',
  styleUrls: ['./add-record.modal.component.scss']
})
export class AddRecordModalComponent {
  @Input() schema!: Schema
  daytimeControl = new FormControl('');
  durationControl = new FormControl('');

  weekdays = new Set<number>()
  daytime_mask = [/[0-2]/, /\d/, ':', /[0-6]/, /\d/]
  select?: number

  week_days: Date[] = []

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit() {
    utils.add_days(this.week_days, false)
  }

  onDayClick(day_: Date) {
    const day = day_.getUTCDay()
    if (this.weekdays.has(day)) {
      this.weekdays.delete(day)
      document.getElementById(`day_${day}`)!.classList.remove('selected_day')
    }
    else {
      this.weekdays.add(day)
      document.getElementById(`day_${day}`)!.classList.add('selected_day')
    }
  }


}
