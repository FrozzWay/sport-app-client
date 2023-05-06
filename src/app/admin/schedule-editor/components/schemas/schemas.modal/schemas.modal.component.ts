import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScheduleSchemasService, Schema, SchemaCreate, SchemaUpdate } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SchemaEditModalComponent } from "../schema-edit.modal/schema-edit-modal.component";
import { concatMap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-schemas.modal-element',
  templateUrl: './schemas.modal.component.html',
  styleUrls: ['./schemas.modal.component.scss']
})
export class SchemasModalComponent {
  @Output() onEditedSchema = new EventEmitter<Schema>();
  @Output() onOpenSchema = new EventEmitter<Schema>();
  @Input() customSchema: boolean = false
  @Input() fromSchema!: Schema
  passive_schemas!: Schema[]
  all_schemas!: Schema[]
  active_schema!: Schema
  next_week_schema?: Schema
  constructor(
    private schema_service: ScheduleSchemasService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    if (!this.fromSchema.active && !this.fromSchema.to_be_active_from)
      this.customSchema = true
    this.schema_service.getSchemas().subscribe(schemas => {
      this.all_schemas = schemas
      this.active_schema = schemas.find(schema => schema.active)!
      this.next_week_schema = schemas.find(schema => new Date(schema.to_be_active_from!) > new Date())
      this.passive_schemas = schemas.filter(schema => schema != this.active_schema && schema != this.next_week_schema)
    })
  }

  edit_schema(schema: Schema) {
    const modalRef = this.modalService.open(SchemaEditModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-s'
    })
    modalRef.componentInstance.schema = schema
    modalRef.result.then((update_fields: SchemaUpdate) => {
      this.schema_service.updateSchema(schema.id, update_fields)
        .subscribe(updated_schema => {
          this.ngOnInit()
          this.onEditedSchema.emit(updated_schema)
        })
    })
  }

  create_schema() {
    const modalRef = this.modalService.open(SchemaEditModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-s'
    })
    modalRef.componentInstance.schemas = this.all_schemas
    modalRef.result.then((res: {schema: SchemaCreate, update_fields: SchemaUpdate}) => {
      this.schema_service.createSchema(res.schema).pipe(concatMap(
        schema => this.schema_service.updateSchema(schema.id, res.update_fields)
      )).subscribe({
      next: (schema) => {
        this.snackBar.open('Схема успешно создана', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
        this.onEditedSchema.emit(schema)
        this.ngOnInit()
      },
      error: (error: HttpErrorResponse) => {
         this.snackBar.open(`Ошибка: ${error.error.detail}`, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
    }})
    })
  }

  view_schema(schema: Schema) {
    this.onOpenSchema.emit(schema)
    this.activeModal.close()
  }

  delete_schema(schema: Schema) {
    this.schema_service.deleteSchema(schema.id).subscribe({
      next: () => {
        this.snackBar.open('Схема удалена', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
        this.passive_schemas = this.passive_schemas.filter(s => s.id != schema.id)
        this.ngOnInit()
      },
      error: (error: HttpErrorResponse) => {
         this.snackBar.open(`Ошибка: ${error.error.detail}`, 'Закрыть', {duration: 5000, verticalPosition: 'top'})
    }})
  }

  back_to_schedule() {
    this.view_schema(this.active_schema)
  }
}

