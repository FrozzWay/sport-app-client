import { Component, Input } from '@angular/core';
import {periods} from 'src/app/public/models'
import * as utils from "../../../../../time-utils";

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

}
