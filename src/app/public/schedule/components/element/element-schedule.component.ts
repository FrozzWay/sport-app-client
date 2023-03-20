import { Component, Input } from '@angular/core';
import { ScheduleRecord } from "../../../../../ApiModule";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: 'app-sched-elem',
  templateUrl: './element-schedule.component.html',
  styleUrls: ['./element-schedule.component.scss']
})
export class ElementScheduleComponent {
  @Input()
  record!: ScheduleRecord;
  begins!: Date
  ends!: Date

  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.registerFontClassAlias('mat-icon-filled', 'material-font-filled mat-ligature-font');
  }

  ngOnInit() {
    this.begins = new Date(this.record.date)
    this.ends = new Date(this.begins)
    this.ends.setMinutes(this.ends.getMinutes() + this.record.duration)
  }
}
