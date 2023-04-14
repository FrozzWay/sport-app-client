import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule, Configuration } from "../../ApiModule";
import { AuthModule } from "../auth/auth.module";
import { InstructorComponent } from './components/instructor/instructor.component';
import { ScheduleEditorComponent } from './schedule-editor/components/main/main.component';
import { MatIconModule } from "@angular/material/icon";
import { TableScheduleEditorComponent } from './schedule-editor/components/table-editor/table-editor.component';
import { ScheduleModule } from "../public/schedule/schedule.module";
import { MatButtonModule } from "@angular/material/button";
import { AddRecordModalComponent } from './schedule-editor/components/add-record.modal/add-record.modal.component';
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "../directives/directives.module";
import { TextMaskModule } from 'angular2-text-mask';
import { MatInputModule } from "@angular/material/input";


@NgModule({
  declarations: [
    InstructorComponent,
    ScheduleEditorComponent,
    TableScheduleEditorComponent,
    AddRecordModalComponent,
  ],
  imports: [
    CommonModule,
    TextMaskModule,
    AuthModule,
    ApiModule,
    MatIconModule,
    ScheduleModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatInputModule
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
export class AdminModule { }
