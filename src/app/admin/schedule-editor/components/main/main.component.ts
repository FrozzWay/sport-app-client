import { Component } from '@angular/core';
import { RecordsService, ScheduleSchemasService, Schema, SchemaRecord } from "src/ApiModule";
import { concatMap, of, from, zip } from "rxjs";
import * as utils from "src/time-utils";
import { SchemaRecords, ScheduleSchemas, periods_SchemaRecord, ApiRecords } from "../../../models";
import { FilterScheduleService } from "src/app/public/schedule/services/filter-schedule.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddRecordModalComponent } from "../add-record.modal/add-record.modal.component";


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
  visible_schema!: Schema
  api_records: ApiRecords = {active: undefined, next_week: undefined}

  constructor(
    public schema_service: ScheduleSchemasService,
    public record_service: RecordsService,
    public filter_service: FilterScheduleService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    document.body.classList.toggle('admin-theme');
    this.prepare_schedule()
    this.schema_service.getSchemas().subscribe((schemas) => this.process_schemas(schemas))
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

    this.schema_service.getRecordsWithinSchema(active_schema.id).subscribe((r) => {
      this.api_records.active = r
      this.filter_service.classify_for_filters(r)
      this.fill_with_records(r, this.schedule_records.current_week)
    })
    if (next_week_schema)
      this.schema_service.getRecordsWithinSchema(next_week_schema.id).subscribe((r) => {
        this.api_records.next_week = r
        this.filter_service.classify_for_filters(r)
        this.fill_with_records(r, this.schedule_records.next_week);
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
    });
    modalRef.componentInstance.schema = this.visible_schema
  }
}
