import { Component } from '@angular/core';
import * as models from "src/ApiModule/model/models";
import { Schedule } from "src/app/public/models"
import * as utils from "src/time-utils"
import { ScheduleService } from "src/ApiModule";


@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent {
  api_schedule!: models.ScheduleRecord[]
  schedule: Schedule = {
    current_week: {},
    next_week: {}
  }
  nw: boolean = false;

  constructor(private schedule_service: ScheduleService,) {
  }

  ngOnInit() {
    this.get_schedule()
  }

  get_schedule() {
    this.schedule_service.getSchedule().subscribe({
      next: (schedule) => {
        this.api_schedule = schedule;
        this.prepare_schedule(schedule)
      },
      error: (err) => {alert('network error')}
    })
  }

  prepare_schedule(schedule: models.ScheduleRecord[]) {
    for (let hours = 0; hours < 24; hours++) {
      this.schedule.current_week[hours] = { dates: {} }
      this.schedule.next_week[hours] = { dates: {} }
      for (let day = 0; day < 7; day++) {
        let date = utils.this_mo()
        date.setDate(date.getDate() + day)
        this.schedule.current_week[hours].dates[date.toLocaleDateString()] = []
        date.setDate(date.getDate() + 7)
        this.schedule.next_week[hours].dates[date.toLocaleDateString()] = []
      }
    }
    schedule.forEach((program: models.ScheduleRecord) => {
      let date = new Date(program.date)
      let [hours, day] = [date.getHours(), date.toLocaleDateString()]
      let week = (date < utils.next_mo()) ? 'current_week' : 'next_week'
      let path = this.schedule[week as keyof Schedule][hours]
      path.filled = true
      path.dates[day].push(program)
    })
  }

  jsonify(obj: any) {
    return JSON.stringify(obj)
  }

  onClick() {
    this.nw = !this.nw
  }
}
