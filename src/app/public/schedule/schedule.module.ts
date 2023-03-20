import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './components/widget/widget.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { TableScheduleComponent } from './components/table/table-schedule.component';
import { ElementScheduleComponent } from './components/element/element-schedule.component';
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [
    WidgetComponent,
    FilterPanelComponent,
    TableScheduleComponent,
    ElementScheduleComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
})
export class ScheduleModule {
}
