import { Component, Input } from '@angular/core';
import { Schema, SchemaCreate, SchemaUpdate } from "src/ApiModule";
import { FormControl } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ConfirmationDialogComponent
} from "../../../../../reusable components/confirmation-dialog/confirmation-dialog.component";

type SchemaAction = 'make_active' | 'activate_next_week';

@Component({
  selector: 'app-schema-edit.modal-element',
  templateUrl: './schema-edit-modal.component.html',
  styleUrls: ['./schema-edit-modal.component.scss']
})
export class SchemaEditModalComponent {
  @Input() schema?: Schema
  @Input() schemas?: Schema[]
  disable_activation: boolean = false
  disable_next_week_elements: boolean = false
  name = new FormControl('');
  baseSchema = new FormControl();
  update_action?: SchemaAction
  disable_next_week_action?: boolean
  msg!: string

  constructor(public activeDialog: NgbActiveModal,
              private modalService: NgbModal) {}

  ngOnInit() {
    if (this.schema) {
      this.msg = 'Редактирование схемы'
      this.name.setValue(this.schema.name)
      this.disable_activation = this.schema.active
      this.disable_next_week_elements = new Date(this.schema.to_be_active_from!) > new Date()
    }
    else {
      this.msg = 'Создание схемы'
    }
  }

  update() {
    let update_fields: SchemaUpdate = {
      name: this.name.value!,
      active: this.update_action == 'make_active',
      activate_next_week: this.update_action == 'activate_next_week' ? true : undefined
    }
    if (this.disable_next_week_action)
      update_fields.activate_next_week = false
      update_fields.active = undefined
    this.activeDialog.close(update_fields)
  }

  create() {
    const update_fields: SchemaUpdate = {
      name: this.name.value!,
      active: this.update_action == 'make_active',
      activate_next_week: this.update_action == 'activate_next_week' ? true : undefined
    }
    const schema: SchemaCreate = {
      name: this.name.value!,
      base_schema: this.baseSchema.value
    }
    this.activeDialog.close({schema: schema, update_fields: update_fields})
  }

  save() {
    if (this.update_action || this.disable_next_week_action) {
      const confirmRef = this.modalService.open(ConfirmationDialogComponent, {
        centered: true,
        size: 'sm'
      })
      confirmRef.componentInstance.header = 'Осторожно'
      confirmRef.componentInstance.message = 'Установка новой (замена) активной или начинающейся со следующей неделе схем снимет записи клиентов на предстоящие занятия, отсутствующие в выбранной схеме.'
      confirmRef.componentInstance.action_text = 'Подтвердить'
      confirmRef.componentInstance.action_class = 'btn-warning'
      confirmRef.result.then(() => this.schema ? this.update() : this.create())
    }
    else this.schema ? this.update() : this.create()
  }
}
