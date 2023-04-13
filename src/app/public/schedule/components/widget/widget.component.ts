import { Component, ViewChild } from '@angular/core';
import * as models from "src/ApiModule/model/models";
import { Filters, Schedule } from "src/app/public/models"
import * as utils from "src/time-utils"
import { ScheduleService } from "src/ApiModule";
import { FilterScheduleService } from "../../services/filter-schedule.service";


@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent {
  api_schedule!: models.ScheduleRecord[]
  selected_record!: models.ScheduleRecord
  schedule: Schedule = {
    current_week: {},
    next_week: {}
  }
  nw: boolean = false;

  constructor(
    private schedule_service: ScheduleService,
    public filter_service: FilterScheduleService
  ) {}

  ngOnInit() {
    this.prepare_schedule()
    this.get_schedule()
  }

  prepare_schedule() {
    for (let hours = 0; hours < 24; hours++) {
      this.schedule.current_week[hours] = { days: {} }
      this.schedule.next_week[hours] = { days: {} }
      for (let day = 0; day < 7; day++) {
        let date = utils.this_mo()
        date.setDate(date.getDate() + day)
        this.schedule.current_week[hours].days[date.toLocaleDateString()] = []
        date.setDate(date.getDate() + 7)
        this.schedule.next_week[hours].days[date.toLocaleDateString()] = []
      }
    }
  }

  get_schedule() {
    this.schedule_service.getSchedule().subscribe({
      next: (schedule) => {
        this.api_schedule = schedule;
        this.fill_schedule(schedule);
        this.filter_service.classify_for_filters(schedule);
      },
      error: (err) => {
        alert('network error')
      }
    })
  }

  fill_schedule(schedule: models.ScheduleRecord[]) {
    schedule.forEach((record: models.ScheduleRecord) => {
      let date = new Date(record.date)
      let [hours, day] = [date.getHours(), date.toLocaleDateString()]
      let week = (date < utils.next_mo()) ? 'current_week' : 'next_week'
      let path = this.schedule[week as keyof Schedule][hours]
      path.filled = true
      path.days[day].push(record)
    })
    this.selected_record = schedule[0]
  }

  filter_schedule(filters: any) {
    const filtered = this.filter_service.filter_schedule(this.api_schedule, filters)
    this.prepare_schedule()
    this.fill_schedule(filtered)
  }

  onClick() {
    this.nw = !this.nw
  }
}
