import { Component, Input } from '@angular/core';
import { ScheduleRecord, SchemaRecord } from "src/ApiModule";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: 'app-sched-elem',
  templateUrl: './element-schedule.component.html',
  styleUrls: ['./element-schedule.component.scss']
})
export class ElementScheduleComponent {
  @Input()
  record!: ScheduleRecord | SchemaRecord;
  begins!: Date
  ends!: Date

  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.registerFontClassAlias('mat-icon-filled', 'material-font-filled mat-ligature-font');
  }

  ngOnInit() {
      if ("date" in this.record) {
        this.begins = new Date(this.record.date)
      }
      else {
        this.begins = new Date(0)
        this.begins.setHours(+this.record.day_time.split(':')[0])
        this.begins.setMinutes(+this.record.day_time.split(':')[1])
      }
    this.ends = new Date(this.begins)
    this.ends.setMinutes(this.ends.getMinutes() + this.record.duration)
  }
}
