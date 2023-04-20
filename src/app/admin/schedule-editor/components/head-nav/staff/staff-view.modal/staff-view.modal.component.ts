import { Component, Input } from '@angular/core';
import { Staff, StaffCreate } from "src/ApiModule";
import { FormControl } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-staff-view.modal-element',
  templateUrl: './staff-view.modal.component.html',
  styleUrls: ['./staff-view.modal.component.scss']
})
export class StaffViewModalComponent {
  @Input() staff?: Staff
  email = new FormControl('');
  username = new FormControl('');
  password = new FormControl('');
  msg!: string
  constructor(public activeDialog: NgbActiveModal) {}

  ngOnInit() {
    if (this.staff) {
      this.msg = 'Просмотр сотрудника'
    } else this.msg = 'Создание сотрудника'
  }

  delete() {
    this.activeDialog.close(this.staff)
  }

  save() {
    let staff: StaffCreate = {
      email: this.email.value!,
      password: this.password.value!,
      username: this.username.value!
    }
    this.activeDialog.close(staff)
  }
}
