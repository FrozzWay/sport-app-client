import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './components/widget/widget.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { TableScheduleComponent } from './components/table/table-schedule.component';
import { ElementScheduleComponent } from './components/element/element-schedule.component';
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DirectivesModule } from "../../directives/directives.module";
import { ModalComponent } from './components/modal/modal.component';
import { ReusableModule } from "../../reusable components/reusable.module";

@NgModule({
  declarations: [
    WidgetComponent,
    FilterPanelComponent,
    TableScheduleComponent,
    ElementScheduleComponent,
    ModalComponent
  ],
    imports: [
      CommonModule,
      MatIconModule,
      MatSelectModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatButtonModule,
      DirectivesModule,
      MatAutocompleteModule,
      MatSnackBarModule,
      ReusableModule,
    ],
})
export class ScheduleModule {
}
