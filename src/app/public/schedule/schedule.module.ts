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
import { RecordModalComponent } from './components/record.modal/record.modal.component';
import { ReusableModule } from "../../reusable components/reusable.module";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { BookingModalComponent } from './components/booking.modal/booking.modal.component';
import { Configuration } from "../../../ApiModule";

@NgModule({
  declarations: [
    WidgetComponent,
    FilterPanelComponent,
    TableScheduleComponent,
    ElementScheduleComponent,
    RecordModalComponent,
    BookingModalComponent
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
    NgbModalModule,
  ],
  providers: [
    {
      provide: Configuration,
      useFactory: () => new Configuration(
        {
          credentials: { OAuth2PasswordBearer : <string>localStorage.getItem("accessToken")},
        }
      ),
    },
  ]
})
export class ScheduleModule {
}
