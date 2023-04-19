import { Component, Input } from '@angular/core';
import { Placement } from "src/ApiModule";
import { FormControl } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-placement-view.modal-element',
  templateUrl: './placement-view.modal.component.html',
  styleUrls: ['./placement-view.modal.component.scss']
})
export class PlacementViewModalComponent {
  @Input() placement?: Placement
  name = new FormControl('');
  msg!: string
  constructor(public activeDialog: NgbActiveModal,) {
  }

  ngOnInit() {
    if (this.placement) {
      this.name.setValue(this.placement.name)
      this.msg = 'Редактирование помещения'
    } else this.msg = 'Создание помещения'
  }

  save() {
    let placement = {
      name: this.name.value,
    }
    this.activeDialog.close(placement)
  }
}
