import { Component } from '@angular/core';
import * as models from "../../../../ApiModule/model/models";
import { InstructorsService } from "../../../../ApiModule";

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent {
  instructors!: Array<models.Instructor>;

  constructor(private instructor_service: InstructorsService) {
  }

  ngOnInit() {
    this.get_instructors()
  }

  get_instructors() {
    return this.instructor_service.getInstructors().subscribe(
      (instructors) => this.instructors = instructors
    )
  }

  jsonify(obj: any) {
    return JSON.stringify(obj)
  }
}
