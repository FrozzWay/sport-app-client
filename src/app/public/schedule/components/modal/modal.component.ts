import { Component, Inject, Input } from '@angular/core';
import { BASE_PATH, InstructorsService, ScheduleRecord } from "src/ApiModule";

@Component({
  selector: 'app-modal-element',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input()
  record!: ScheduleRecord
  begins!: Date
  ends!: Date
  photo_url!: string
  constructor(@Inject(BASE_PATH) private basePath: string, private instructor_service: InstructorsService) {
  }

  ngOnChanges() {
    this.begins = new Date(this.record.date)
    this.ends = new Date(this.begins)
    this.ends.setMinutes(this.ends.getMinutes() + this.record.duration)
    this.instructor_service.getInstructorImage(this.record.program.instructor.id).subscribe({
      next: (instructor) => {
        if (instructor.photo_src)
          this.photo_url = `${this.basePath}/${instructor.photo_src}`
      }
    })
  }
}
