import { Component } from '@angular/core';
import { ScheduleSchemasService, Schema, SchemaCreate, SchemaUpdate } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SchemaViewModalComponent } from "../schema-view.modal/schema-view.modal.component";
import { concatMap } from "rxjs";

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

  view_schema(schema: Schema) {
    const modalRef = this.modalService.open(SchemaViewModalComponent, {
      size: 'sm',
      centered: true
    })
    modalRef.componentInstance.schema = schema
    modalRef.result.then((update_fields: SchemaUpdate) => {
      this.schema_service.updateSchema(schema.id, update_fields).subscribe(_ => this.ngOnInit())
    })
  }

  create_schema() {
    const modalRef = this.modalService.open(SchemaViewModalComponent, {
      size: 'sm',
      centered: true
    })
    modalRef.componentInstance.schemas = this.schemas
    modalRef.result.then((res: {schema: SchemaCreate, update_fields: SchemaUpdate}) => {
      this.schema_service.createSchema(res.schema).pipe(concatMap(
        schema => this.schema_service.updateSchema(schema.id, res.update_fields)
      )).subscribe(schema => {
        this.ngOnInit()
      })
    })
  }
}

