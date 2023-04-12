import { Component, ViewChild } from '@angular/core';
import * as models from "src/ApiModule/model/models";
import { Filters, Schedule } from "src/app/public/models"
import * as utils from "src/time-utils"
import { ScheduleService } from "src/ApiModule";


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
  filters: Filters = {
    programs: new Map<number, string>(),
    instructors: new Map<number, string>(),
    categories: new Set<string>(),
    placements: new Set<string>()
  }
  nw: boolean = false;

  constructor(private schedule_service: ScheduleService,) {
  }

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

  classify_for_filters() {
    this.api_schedule.forEach((record) => {
      let program = record.program
      this.filters.categories.add(program.category.name)
      this.filters.instructors.set(program.instructor.id, record.program.instructor.credentials)
      this.filters.placements.add(program.placement.name)
      this.filters.programs.set(program.id,program.name)
    })
  }

  get_schedule() {
    this.schedule_service.getSchedule().subscribe({
      next: (schedule) => {
        this.api_schedule = schedule;
        this.fill_schedule(schedule);
        this.classify_for_filters();
      },
      error: (err) => {alert('network error')}
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
    let schedule: models.ScheduleRecord[] = Array.from(this.api_schedule)
    if (filters.programs.size > 0)
      schedule = this.api_schedule.filter(record => filters.programs.has(record.program.id))
    if (filters.instructors.size > 0)
      schedule = schedule.filter(record => filters.instructors.has(record.program.instructor.id))
    if (filters.categories.size > 0)
      schedule = schedule.filter(record => filters.categories.has(record.program.category.name))
    if (filters.placements.size > 0)
      schedule = schedule.filter(record => filters.placements.has(record.program.placement.name))
    if (!filters.paid)
      schedule = schedule.filter(record => !record.program.paid)
    if (!filters.available_registration)
      schedule = schedule.filter(record => !record.program.available_registration)
    this.prepare_schedule()
    this.fill_schedule(schedule)
  }

  jsonify(obj: any) {
    return JSON.stringify(obj)
  }

  onClick() {
    this.nw = !this.nw
  }
}
