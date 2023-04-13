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


@NgModule({
  declarations: [
    InstructorComponent,
    ScheduleEditorComponent,
    TableScheduleEditorComponent,
  ],
  imports: [
    CommonModule,
    AuthModule,
    ApiModule,
    MatIconModule,
    ScheduleModule,
    MatButtonModule
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
