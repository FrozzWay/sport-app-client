import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleModule } from "./schedule/schedule.module";
import { ApiModule } from "../../ApiModule";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ScheduleModule,
    ApiModule
  ]
})
export class PublicModule { }
