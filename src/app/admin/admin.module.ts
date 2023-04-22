import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule, Configuration } from "../../ApiModule";
import { AuthModule } from "../auth/auth.module";
import { ScheduleEditorComponent } from './schedule-editor/components/main/main.component';
import { MatIconModule } from "@angular/material/icon";
import { TableScheduleEditorComponent } from './schedule-editor/components/table-editor/table-editor.component';
import { ScheduleModule } from "../public/schedule/schedule.module";
import { MatButtonModule } from "@angular/material/button";
import { AddRecordModalComponent } from './schedule-editor/components/add-record.modal/add-record.modal.component';
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "../directives/directives.module";
import { MatInputModule } from "@angular/material/input";
import { ReusableModule } from "../reusable components/reusable.module";
import { IMaskDirective } from "angular-imask";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ProgramOverviewComponent } from './schedule-editor/components/program-overview/program-overview.component';
import {
  ViewRecordModalComponent
} from './schedule-editor/components/view-record.modal/view-record.modal.component';
import { CategoriesModalComponent } from './schedule-editor/components/head-nav/categories/categories.modal/categories.modal.component';
import { SchemasModalComponent } from './schedule-editor/components/schemas.modal/schemas.modal.component';
import { CategoryViewModalComponent } from './schedule-editor/components/head-nav/categories/category-view.modal/category-view.modal.component.';
import { PlacementsModalComponent } from './schedule-editor/components/head-nav/placements/placements.modal/placements.modal.component';
import { PlacementViewModalComponent } from './schedule-editor/components/head-nav/placements/placement-view.modal/placement-view.modal.component';
import { InstructorModalComponent } from './schedule-editor/components/head-nav/instructors/instructor.modal/instructor.modal.component';
import { InstructorViewModalComponent } from './schedule-editor/components/head-nav/instructors/instructor-view.modal/instructor-view.modal.component';
import { ClientModalComponent } from './schedule-editor/components/head-nav/clients/client.modal/client.modal.component';
import { ClientViewModalComponent } from './schedule-editor/components/head-nav/clients/client-view.modal/client-view.modal.component';
import { ProgramModalComponent } from './schedule-editor/components/head-nav/programs/program.modal/program.modal.component';
import { ProgramViewModalComponent } from './schedule-editor/components/head-nav/programs/program-view.modal/program-view.modal.component';
import { StaffModalComponent } from './schedule-editor/components/head-nav/staff/staff.modal/staff.modal.component';
import { StaffViewModalComponent } from './schedule-editor/components/head-nav/staff/staff-view.modal/staff-view.modal.component';
import { MatMenuModule } from "@angular/material/menu";
import { ProgramReportMakerModalComponent } from './schedule-editor/components/head-nav/reports/program-report-maker.modal/program-report-maker.modal.component';
import { MatRadioModule } from "@angular/material/radio";
import { ProgramReportViewModalComponent } from './schedule-editor/components/head-nav/reports/program-report-view.modal/program-report-view.modal.component';
import { ClientReportMakerModalComponent } from './schedule-editor/components/head-nav/reports/client-report-maker.modal/client-report-maker.modal.component';
import { ClientReportViewModalComponent } from './schedule-editor/components/head-nav/reports/client-report-view.modal/client-report-view.modal.component';


@NgModule({
  declarations: [
    ScheduleEditorComponent,
    TableScheduleEditorComponent,
    AddRecordModalComponent,
    ProgramOverviewComponent,
    ViewRecordModalComponent,
    CategoriesModalComponent,
    SchemasModalComponent,
    CategoryViewModalComponent,
    PlacementsModalComponent,
    PlacementViewModalComponent,
    InstructorModalComponent,
    InstructorViewModalComponent,
    ClientModalComponent,
    ClientViewModalComponent,
    ProgramModalComponent,
    ProgramViewModalComponent,
    StaffModalComponent,
    StaffViewModalComponent,
    ProgramReportMakerModalComponent,
    ProgramReportViewModalComponent,
    ClientReportMakerModalComponent,
    ClientReportViewModalComponent,
  ],
  imports: [
    CommonModule,
    AuthModule,
    ApiModule,
    MatIconModule,
    ScheduleModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatInputModule,
    ReusableModule,
    IMaskDirective,
    MatExpansionModule,
    MatProgressBarModule,
    MatCheckboxModule,
    FormsModule,
    MatMenuModule,
    MatRadioModule
  ],
})
export class AdminModule {
}
