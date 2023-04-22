import { Component, Input } from '@angular/core';
import { Schema, SchemaCreate, SchemaUpdate } from "src/ApiModule";
import { FormControl } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ConfirmationDialogComponent
} from "../../../../../reusable components/confirmation-dialog/confirmation-dialog.component";

type SchemaAction = 'make_active' | 'activate_next_week';

@Component({
  selector: 'app-schema-view.modal',
  templateUrl: './schema-view.modal.component.html',
  styleUrls: ['./schema-view.modal.component.scss']
})
export class SchemaViewModalComponent {
  @Input() schema?: Schema
  @Input() schemas?: Schema[]
  name = new FormControl('');
  baseSchema = new FormControl();
  update_action?: SchemaAction
  msg!: string

  constructor(public activeDialog: NgbActiveModal,
              private modalService: NgbModal) {}

  ngOnInit() {
    if (this.schema) {
      this.msg = 'Редактирование схемы'
    }
  }

  update() {
    const update_fields: SchemaUpdate = {
      name: this.name.value!,
      active: this.update_action == 'make_active',
      activate_next_week: this.update_action == 'activate_next_week'
    }
    this.activeDialog.close(update_fields)
  }

  create() {
    const update_fields: SchemaUpdate = {
      name: this.name.value!,
      active: this.update_action == 'make_active',
      activate_next_week: this.update_action == 'activate_next_week'
    }
    const schema: SchemaCreate = {
      name: this.name.value!,
      base_schema: this.baseSchema.value
    }
    this.activeDialog.close({schema: schema, update_fields: update_fields})
  }

  save() {
    if (this.update_action) {
      const confirmRef = this.modalService.open(ConfirmationDialogComponent, {
        centered: true,
        size: 'sm'
      })
      confirmRef.componentInstance.header = 'Осторожно'
      confirmRef.componentInstance.message = 'Установка новой (замена) активной или начинающейся со следующей неделе схем удалит записи клиентов на занятия, отсутствующие в выбранной схеме, если такие были.'
      confirmRef.componentInstance.action_text = 'Подтвердить'
      confirmRef.componentInstance.action_class = 'btn-warning'
      confirmRef.result.then(() => this.schema ? this.update() : this.create())
    }
    else this.schema ? this.update() : this.create()
  }
}
