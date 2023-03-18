import { Component } from '@angular/core';
import * as models from "../../../../../ApiModule/model/models";
import { ScheduleService } from "../../../../../ApiModule";


interface periods {
  [hour: number] : {
    [date: string]: models.ScheduleRecord[]
  }
}

interface Schedule {
  current_week: periods,
  next_week: periods
}


@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent {
  api_schedule!: models.ScheduleRecord[]
  schedule!: Schedule

  constructor(private schedule_service: ScheduleService,) {
  }

  ngOnInit() {
    this.get_schedule()
  }

  get_schedule() {
    this.schedule_service.getSchedule().subscribe(
      (schedule) => {this.api_schedule = schedule; this.prepare_schedule(schedule)}
    )
  }

  classify_program(program: models.ScheduleRecord) {
    let date = new Date(program.date)
    let [hours, day] = [date.getHours(), date.toDateString()]
    let week = (date < this.next_mo()) ? 'current_week' : 'next_week'
    let path = this.schedule[week as keyof Schedule][hours][day]
    path.push(program)
  }

  prepare_schedule(schedule: models.ScheduleRecord[]) {
    this.schedule = {
      current_week: {},
      next_week: {}
    }
    for (let hours = 0; hours < 24; hours++) {
      this.schedule.current_week[hours] = {}
      this.schedule.next_week[hours] = {}
        for (let day = 0; day < 7; day++) {
          let date = this.this_mo()
          date.setDate(date.getDate() + day)
          this.schedule.current_week[hours][date.toLocaleDateString()] = []
          date.setDate(date.getDate() + 7)
          this.schedule.next_week[hours][date.toLocaleDateString()] = []
        }
    }
    schedule.forEach((program: models.ScheduleRecord) => {
      let date = new Date(program.date)
      let [hours, day] = [date.getHours(), date.toLocaleDateString()]
      let week = (date < this.next_mo()) ? 'current_week' : 'next_week'
      let path = this.schedule[week as keyof Schedule][hours][day]
      path.push(program)
    })
    console.log(this.schedule)
  }

  next_mo(): Date {
    let date = this.this_mo()
    date.setDate(date.getDate() + 7)
    return date
  }

  this_mo(): Date {
    return this.getMonday(new Date())
  }

  getMonday(d: Date) {
    d = new Date(d)
    d.setHours(0,0,0,0)
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1);
    return new Date(d.setDate(diff));
  }

  jsonify(obj: any) {
    return JSON.stringify(obj)
  }
}
