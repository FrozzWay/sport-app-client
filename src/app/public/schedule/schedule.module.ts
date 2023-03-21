import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './components/widget/widget.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { TableScheduleComponent } from './components/table/table-schedule.component';
import { ElementScheduleComponent } from './components/element/element-schedule.component';
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
  declarations: [
    WidgetComponent,
    FilterPanelComponent,
    TableScheduleComponent,
    ElementScheduleComponent
  ],
    imports: [
        CommonModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCheckboxModule
    ],
})
export class ScheduleModule {
}
