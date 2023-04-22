import { Component, EventEmitter } from '@angular/core';
import { Category, Placement, RecordsService, ScheduleSchemasService, Schema, SchemaRecord } from "src/ApiModule";
import { concatMap, of } from "rxjs";
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


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class ScheduleEditorComponent {
  nw: boolean = false;
  schedule_schemas: ScheduleSchemas = { active: undefined, next_week: undefined }
  schedule_records: SchemaRecords = {
    current_week: {},
    next_week: {}
  }
  selected_schema?: Schema
  visible_schema!: Schema
  api_records: ApiRecords = {active: undefined, next_week: undefined}
  applied_filters?: any
  onQueriedRecords = new EventEmitter();

  constructor(
    public schema_service: ScheduleSchemasService,
    public record_service: RecordsService,
    public filter_service: FilterScheduleService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    document.body.classList.toggle('admin-theme');
    this.prepare_schedule()
    if (!this.selected_schema)
      this.schema_service.getSchemas().subscribe((schemas) => this.process_schemas(schemas))
    else
      this.query_records_schema(this.selected_schema)
  }

  ngAfterViewInit() {
    let pos = document.getElementById('dates-table-header')!.getBoundingClientRect().bottom * 2
    document.getElementById('missingNwSchema-message')!.setAttribute('style', `height:calc(100vh - ${pos}px)`)
  }

  process_schemas(schemas: Schema[]) {
    const active_schema = schemas.find((element) => element.active)!
    let next_week_schema = schemas.find((element) => element.to_be_active_from)
    if (next_week_schema)
      if (new Date(next_week_schema.to_be_active_from!) < new Date())
        next_week_schema = undefined
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
      this.api_records.active = r
      this.filter_service.classify_for_filters(r)
      this.fill_with_records(r, this.schedule_records.current_week)
    })
  }

  prepare_schedule() {
    for (let hours = 0; hours < 24; hours++) {
      this.schedule_records.current_week[hours] = { days: {} }
      this.schedule_records.next_week[hours] = { days: {} }
      for (let day = 0; day < 7; day++) {
        this.schedule_records.current_week[hours].days[day] = []
        this.schedule_records.next_week[hours].days[day] = []
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
  }

  slide_schema() {
    if (!this.nw && this.schedule_schemas.next_week)
      this.visible_schema = this.schedule_schemas.next_week
    if (this.nw)
      this.visible_schema = this.schedule_schemas.active!
    this.nw = !this.nw
  }

  open_add_record_modal() {
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
        this.reRenderRecords(true)
      }
    else {
      this.api_records.active!.push(...added_records)
      this.reRenderRecords(false)
    }
  }

  onRemoveRecord(record: SchemaRecord) {
    if (this.visible_schema == this.schedule_schemas.next_week) {
        this.api_records.next_week = this.api_records.next_week!.filter(r => r !== record)
        this.reRenderRecords(true)
      }
    else {
      this.api_records.active = this.api_records.active!.filter(r => r !== record)
      this.reRenderRecords(false)
    }
  }

  reRenderRecords(nw: boolean) {
    if (nw) {
      this.filter_service.classify_for_filters(this.api_records.next_week!)
      if (this.applied_filters)
        this.filter_schedule(this.applied_filters)
      else
        this.prepare_schedule()
      this.fill_with_records(this.api_records.next_week!, this.schedule_records.next_week)
    } else {
      this.filter_service.classify_for_filters(this.api_records.active!)
      if (this.applied_filters)
        this.filter_schedule(this.applied_filters)
      else {
        this.prepare_schedule()
        this.fill_with_records(this.api_records.active!, this.schedule_records.current_week)
      }
    }
  }

  reInit() {
    this.prepare_schedule()
    if (this.selected_schema)
      this.query_records_schema(this.selected_schema)
    else
      this.query_records_for_active_schedule()

    this.onQueriedRecords.subscribe(_ => {
      this.reRenderRecords(false)
      if (this.schedule_schemas.next_week)
        this.reRenderRecords(true)
    })
  }

  create_next_week() {

  }

  category_modal() {
    const modalRef = this.modalService.open(CategoriesModalComponent, {
      scrollable: true
    })
    modalRef.componentInstance.onUpdate.subscribe((category: Category)=> {
      this.filter_service.cleanup_filters()
      this.reInit();
    })
  }

  placement_modal() {
    const modalRef = this.modalService.open(PlacementsModalComponent, {
      scrollable: true
    })
    modalRef.componentInstance.onUpdate.subscribe((placement: Placement)=> {
      this.filter_service.cleanup_filters()
      this.reInit()
    })
  }

  instructor_modal() {
    const modalRef = this.modalService.open(InstructorModalComponent, {
      scrollable: true
    })
    modalRef.componentInstance.onUpdate.subscribe(() => {
      this.filter_service.cleanup_filters()
      this.reInit()
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
      this.filter_service.cleanup_filters()
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
}
