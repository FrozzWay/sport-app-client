import { Component, Inject, Input } from '@angular/core';
import { Instructor } from "src/ApiModule";
import { FormControl } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { STATIC_PATH } from "../../../../../../app.module";

@Component({
  selector: 'app-instructor-view.modal-element',
  templateUrl: './instructor-view.modal.component.html',
  styleUrls: ['./instructor-view.modal.component.scss']
})
export class InstructorViewModalComponent {
  @Input() instructor?: Instructor
  credentials = new FormControl('');
  phone = new FormControl('');
  phone_mask = {
    mask: '+{7} (000) 000-00-00'
  }
  photo_url?: string
  msg!: string
  constructor(
    public activeDialog: NgbActiveModal,
    @Inject(STATIC_PATH) private staticPath: string,) {}

  ngOnInit() {
    if (this.instructor) {
      this.credentials.setValue(this.instructor.credentials)
      this.phone.setValue(this.instructor.phone)
      this.msg = 'Редактирование инструктора'
      if (this.instructor.photo_src)
          this.photo_url = `${this.staticPath}/${this.instructor.photo_src}`
    } else this.msg = 'Создание инструктора'
  }

  save() {
    let instructor = {
      phone: this.phone.value,
      credentials: this.credentials.value
    }
    this.activeDialog.close(instructor)
  }
}
