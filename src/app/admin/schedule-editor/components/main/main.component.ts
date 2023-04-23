import { Component, EventEmitter, ViewChild } from '@angular/core';
import {
  Category,
  Instructor,
  Placement,
  ScheduleSchemasService,
  Schema,
  SchemaRecord
} from "src/ApiModule";
import { concatMap, of, take } from "rxjs";
import { SchemaRecords, ScheduleSchemas, periods_SchemaRecord, ApiRecords } from "../../../models";
import { FilterScheduleService } from "src/app/public/schedule/services/filter-schedule.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddRecordModalComponent } from "../add-record.modal/add-record.modal.component";
import { CategoriesModalComponent } from "../head-nav/categories/categories.modal/categories.modal.component";
import { PlacementsModalComponent } from "../head-nav/placements/placements.modal/placements.modal.component";
import { InstructorModalComponent } from "../head-nav/instructors/instructor.modal/instructor.modal.component";
import { ClientModalComponent } from "../head-nav/clients/client.modal/client.modal.component";
import { ProgramModalComponent } from "../head-nav/programs/program.modal/program.modal.component";
import { StaffModalComponent } from "../head-nav/staff/staff.modal/staff.modal.component";
import {
  ProgramReportMakerModalComponent
} from "../head-nav/reports/program-report-maker.modal/program-report-maker.modal.component";
import {
  ClientReportMakerModalComponent
} from "../head-nav/reports/client-report-maker.modal/client-report-maker.modal.component";
import { SchemasModalComponent } from "../schemas/schemas.modal/schemas.modal.component";
import { FilterPanelComponent } from "../../../../public/schedule/components/filter-panel/filter-panel.component";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class ScheduleEditorComponent {
  @ViewChild(FilterPanelComponent) filter_panel!: FilterPanelComponent
  nw: boolean = false;
  schedule_schemas: ScheduleSchemas = { active: undefined, next_week: undefined}
  schedule_records: SchemaRecords = {
    current_week: {},
    next_week: {},
    custom: {}
  }
  selected_custom_schema?: Schema
  visible_schema!: Schema
  api_records: ApiRecords = {active: undefined, next_week: undefined, custom: undefined}
  applied_filters?: any
  onQueriedRecords = new EventEmitter();

  constructor(
    public schema_service: ScheduleSchemasService,
    public filter_service: FilterScheduleService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    document.body.classList.add('admin-theme');
    this.prepare_schedule()
    if (!this.selected_custom_schema)
      this.schema_service.getSchemas().subscribe((schemas) => this.process_schemas(schemas))
    else
      this.query_records_schema(this.selected_custom_schema)
  }

  ngAfterViewInit() {
    this.position_missingNwSchema_message()
  }

  reInit() {
    this.filter_service.cleanup_filters()
    this.applied_filters = undefined
    this.filter_panel.dropFormControls()
    this.ngOnInit();
  }

  position_missingNwSchema_message() {
    const tables = document.getElementsByClassName('dates-table-header')
    let pos = tables.item(0)!.getBoundingClientRect().bottom * 2
    if (pos == 0) pos = tables.item(1)!.getBoundingClientRect().bottom * 2
    document.getElementById('missingNwSchema-message')!.setAttribute('style', `height:calc(100vh - ${pos}px)`)
  }

  process_schemas(schemas: Schema[]) {
    const active_schema = schemas.find((schema) => schema.active)!
    let next_week_schema = schemas.find((schema) => new Date(schema.to_be_active_from!) > new Date())
    this.schedule_schemas.active = active_schema
    this.schedule_schemas.next_week = next_week_schema
    this.visible_schema = active_schema
    this.query_records_for_active_schedule()
  }

  query_records_for_active_schedule() {
    this.schema_service.getRecordsWithinSchema(this.schedule_schemas.active!.id).pipe(concatMap(r => {
      this.api_records.active = r
      this.filter_service.classify_for_filters(r)
      this.fill_with_records(r, this.schedule_records.current_week)
      return of(1)
    })).pipe(concatMap(_ => {
      if (this.schedule_schemas.next_week)
        this.schema_service.getRecordsWithinSchema(this.schedule_schemas.next_week.id).subscribe(r => {
          this.api_records.next_week = r
          this.filter_service.classify_for_filters(r)
          this.fill_with_records(r, this.schedule_records.next_week);
        });
      return of(1);
    })).subscribe(_ => this.onQueriedRecords.emit())
  }

  query_records_schema(schema: Schema) {
    this.schema_service.getRecordsWithinSchema(schema.id).subscribe((r) => {
      this.api_records.custom = r
      this.filter_service.classify_for_filters(r)
      this.fill_with_records(r, this.schedule_records.custom)
      this.onQueriedRecords.emit()
    })
  }

  prepare_schedule() {
    for (let hours = 0; hours < 24; hours++) {
      this.schedule_records.current_week[hours] = { days: {} }
      this.schedule_records.next_week[hours] = { days: {} }
      this.schedule_records.custom[hours] = { days: {} }
      for (let day = 0; day < 7; day++) {
        this.schedule_records.current_week[hours].days[day] = []
        this.schedule_records.next_week[hours].days[day] = []
        this.schedule_records.custom[hours].days[day] = []
      }
    }
  }

  fill_with_records(records: SchemaRecord[], container: periods_SchemaRecord) {
    records.forEach((r) => {
      const [hours, day] = [r.day_time.split(':')[0], r.week_day]
      container[+hours].filled = true
      container[+hours].days[day].push(r)
    })
  }

  remove_records(records: SchemaRecord[], container: periods_SchemaRecord) {
    records.forEach((r) => {
      const [hours, day] = [r.day_time.split(':')[0], r.week_day]
      container[+hours].days[day] = container[+hours].days[day].filter(rec => r !== rec)
      let filled = false
      for (const [day, value] of Object.entries(container[+hours].days))
        if (value.length > 0) filled = true
      if (!filled) container[+hours].filled = false
    })
  }

  filter_schedule(filters: any) {
    this.applied_filters = filters
    this.prepare_schedule()
    if (this.api_records.active) {
      const filtered = this.filter_service.filter_schedule(this.api_records.active, filters);
      this.fill_with_records(filtered, this.schedule_records.current_week);
    }
    if (this.api_records.next_week) {
      const filtered = this.filter_service.filter_schedule(this.api_records.next_week, filters);
      this.fill_with_records(filtered, this.schedule_records.next_week);
    }
    if (this.api_records.custom) {
      const filtered = this.filter_service.filter_schedule(this.api_records.custom, filters);
      this.fill_with_records(filtered, this.schedule_records.custom);
    }
  }

  slide_schema() {
    if (!this.nw && this.schedule_schemas.next_week)
      this.visible_schema = this.schedule_schemas.next_week
    if (this.nw)
      this.visible_schema = this.schedule_schemas.active!
    this.nw = !this.nw
  }

  open_add_record_modal() {
    console.log(this.schedule_records)
    const modalRef = this.modalService.open(AddRecordModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      scrollable: true,
      windowClass: 'windowClass',
    });
    modalRef.componentInstance.schema = this.visible_schema
    modalRef.componentInstance.onAddRecords.subscribe((added_records: SchemaRecord[]) => this.onAddRecords(added_records))
  }

  onAddRecords(added_records: SchemaRecord[]) {
    if (this.visible_schema == this.schedule_schemas.next_week) {
      this.api_records.next_week!.push(...added_records)
      this.fill_with_records(added_records, this.schedule_records.next_week)
    }
    if (this.visible_schema == this.schedule_schemas.active) {
      this.api_records.active!.push(...added_records)
      this.fill_with_records(added_records, this.schedule_records.current_week)
    }
    else {
      this.api_records.custom!.push(...added_records)
      this.fill_with_records(added_records, this.schedule_records.custom)
    }
    this.filter_service.classify_for_filters(added_records)
  }

  onRemoveRecord(record: SchemaRecord) {
    if (this.visible_schema == this.schedule_schemas.next_week) {
        this.api_records.next_week = this.api_records.next_week!.filter(r => r !== record)
        this.remove_records([record], this.schedule_records.next_week)
      }
    if (this.visible_schema == this.schedule_schemas.active) {
      this.api_records.active = this.api_records.active!.filter(r => r !== record)
      this.remove_records([record], this.schedule_records.current_week)
    }
    else {
      this.api_records.custom = this.api_records.custom!.filter(r => r !== record)
      this.remove_records([record], this.schedule_records.custom)
    }
  }

  create_next_week() {

  }

  category_modal() {
    const modalRef = this.modalService.open(CategoriesModalComponent, {
      scrollable: true
    })
    modalRef.componentInstance.onUpdate.subscribe((category: Category)=> {
      this.filter_service.cleanup_filters()
      this.ngOnInit()
      if (this.applied_filters) {
        (this.applied_filters.categories as Set<string>).delete(category.name)
        this.onQueriedRecords.pipe(take(1)).subscribe(_ => this.filter_schedule(this.applied_filters))
      }
    })
  }

  placement_modal() {
    const modalRef = this.modalService.open(PlacementsModalComponent, {
      scrollable: true
    })
    modalRef.componentInstance.onUpdate.subscribe((placement: Placement)=> {
      this.filter_service.cleanup_filters()
      this.ngOnInit()
      if (this.applied_filters) {
        (this.applied_filters.placements as Set<string>).delete(placement.name)
        this.onQueriedRecords.pipe(take(1)).subscribe(_ => this.filter_schedule(this.applied_filters))
      }
    })
  }

  instructor_modal() {
    const modalRef = this.modalService.open(InstructorModalComponent, {
      scrollable: true
    })
    modalRef.componentInstance.onUpdate.subscribe((instructor: Instructor) => {
      this.filter_service.cleanup_filters()
      this.ngOnInit()
      if (this.applied_filters) {
        this.onQueriedRecords.pipe(take(1)).subscribe(_ => this.filter_schedule(this.applied_filters))
      }
    })
  }

  client_modal() {
    this.modalService.open(ClientModalComponent, {
      scrollable: true
    })
  }

  program_modal() {
    const modalRef = this.modalService.open(ProgramModalComponent, {
      scrollable: true
    })
    modalRef.componentInstance.onDelete.subscribe(() => {
      this.reInit()
    })
  }

  staff_modal() {
    this.modalService.open(StaffModalComponent, {
      scrollable: true
    })
  }

  report_program_modal() {
    this.modalService.open(ProgramReportMakerModalComponent, {
      scrollable: true,
      windowClass: 'program-report-maker'
    })
  }

  report_client_modal() {
    this.modalService.open(ClientReportMakerModalComponent, {
      scrollable: true,
      windowClass: 'client-report-maker'
    })
  }

  schemas_modal() {
    const modalRef = this.modalService.open(SchemasModalComponent, {
      scrollable: true,
    })
    modalRef.componentInstance.fromSchema = this.visible_schema

    modalRef.componentInstance.onEditedSchema
      .subscribe((updated_schema: Schema) => {
        const custom_schema = this.selected_custom_schema

        if (this.visible_schema.id == updated_schema.id)
          this.visible_schema.name = updated_schema.name

        // if (this.schedule_schemas.active!.id == updated_schema.id)
        //   this.schedule_schemas.active!.name = updated_schema.name

        if (updated_schema.to_be_active_from) {
          if (custom_schema) {
            if (custom_schema.id == updated_schema.id)
              this.open_active_schema()
            return
          }
          this.schedule_schemas.next_week = updated_schema
          this.reInit()
          this.onQueriedRecords.pipe(take(1)).subscribe(() => {
            this.visible_schema = this.nw ? this.schedule_schemas.next_week! : this.schedule_schemas.active!
          })
        }

        // deactivation of next_week schema
        if (this.schedule_schemas.next_week?.id == updated_schema.id) {
          if (!updated_schema.to_be_active_from) {
            this.schedule_schemas.next_week = undefined
            setTimeout(() => this.position_missingNwSchema_message())
            this.visible_schema = this.schedule_schemas.active!
          }
        }
      })

    modalRef.componentInstance.onOpenSchema
      .subscribe((schema: Schema) => {
        if (!schema.active) {
          this.selected_custom_schema = schema
          this.visible_schema = schema
          this.reInit()
        }
        else
          this.open_active_schema()
      })
  }

  open_active_schema() {
    this.selected_custom_schema = undefined
    this.nw = false
    this.reInit()
  }
}
