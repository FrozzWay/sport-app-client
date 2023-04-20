import { Component, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: []
})
export class ConfirmationDialogComponent {
  @Input() header!: string
  @Input() message!: string
  @Input() action_text?: string = 'Удалить'
  @Input() action_class?: string = 'btn-danger'

  constructor(public activeDialog: NgbActiveModal,) {}
}
