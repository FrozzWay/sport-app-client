import { Component, Inject, Input } from '@angular/core';
import { BASE_PATH, Client, InstructorsService, ScheduleRecord } from "src/ApiModule";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-modal-element',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input()
  record!: ScheduleRecord
  registration_opens_at?: Date
  begins!: Date
  ends!: Date
  photo_url!: string
  clientControl = new FormControl<string | any>('');
  selected_client?: Client

  options = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];

  constructor(@Inject(BASE_PATH) private basePath: string, private instructor_service: InstructorsService) {
  }

  ngOnChanges() {
    this.begins = new Date(this.record.date)
    this.ends = new Date(this.begins)
    this.ends.setMinutes(this.ends.getMinutes() + this.record.duration)
    if (this.record.registration_opens_at)
      this.registration_opens_at = new Date(this.record.registration_opens_at)

    this.instructor_service.getInstructorImage(this.record.program.instructor.id).subscribe({
      next: (instructor) => {
        if (instructor.photo_src)
          this.photo_url = `${this.basePath}/${instructor.photo_src}`
      }
    })

    //this.clientControl.valueChanges.subscribe()
  }

}
