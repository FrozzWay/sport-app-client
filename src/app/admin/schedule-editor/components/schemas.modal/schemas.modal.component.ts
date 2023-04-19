import { Component } from '@angular/core';
import { ScheduleSchemasService, Schema } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-schemas.modal-element',
  templateUrl: './schemas.modal.component.html',
  styleUrls: ['./schemas.modal.component.scss']
})
export class SchemasModalComponent {
  schemas!: Schema[]
  active_schema!: Schema
  next_week_schema?: Schema
  constructor(
    private schema_service: ScheduleSchemasService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.schema_service.getSchemas().subscribe(schemas => {
      this.active_schema = schemas.find(schema => schema.active)!
      this.next_week_schema = schemas.find(schema => new Date(schema.to_be_active_from!) > new Date())
      this.schemas = schemas.filter(schema => schema !== this.active_schema || schema !== this.next_week_schema)
    })
  }
}

