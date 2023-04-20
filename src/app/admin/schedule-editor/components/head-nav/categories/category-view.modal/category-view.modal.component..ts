import { Component, Input } from '@angular/core';
import { Category } from "src/ApiModule";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-category-view.modal-element',
  templateUrl: './category-view.modal.component..html',
  styleUrls: ['./category-view.modal.component..scss']
})
export class CategoryViewModalComponent {
  @Input() category?: Category
  name = new FormControl('');
  color = new FormControl('');
  msg!: string
  constructor(public activeDialog: NgbActiveModal,) {
  }

  ngOnInit() {
    if (this.category) {
      this.name.setValue(this.category.name)
      this.color.setValue(this.category.color)
      this.msg = 'Редактирование категории'
    } else this.msg = 'Создание категории'
  }

  save() {
    let category = {
      name: this.name.value,
      color: this.color.value
    }
    this.activeDialog.close(category)
  }
}
