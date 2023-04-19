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
import { CategoriesModalComponent } from './schedule-editor/components/categories/categories.modal/categories.modal.component';
import { SchemasModalComponent } from './schedule-editor/components/schemas.modal/schemas.modal.component';
import { CategoryViewModalComponent } from './schedule-editor/components/categories/category-view.modal/category-view.modal.component.';
import { PlacementsModalComponent } from './schedule-editor/components/placements/placements.modal/placements.modal.component';
import { PlacementViewModalComponent } from './schedule-editor/components/placements/placement-view.modal/placement-view.modal.component';


@NgModule({
  declarations: [
    InstructorComponent,
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
    FormsModule
  ],
})
export class AdminModule {
}
