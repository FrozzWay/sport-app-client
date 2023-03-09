import { Component } from '@angular/core';
import * as models from "../../../../../ApiModule/model/models";
import { ScheduleService } from "../../../../../ApiModule";

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent {
  schedule!: models.ScheduleRecord[]

  constructor(private schedule_service: ScheduleService,) {
  }

  ngOnInit() {
    this.get_schedule()
  }

  get_schedule() {
    return this.schedule_service.getSchedule().subscribe(
      (schedule) => this.schedule = schedule
    )
  }

  jsonify(obj: any) {
    return JSON.stringify(obj)
  }
}
