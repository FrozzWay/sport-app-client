import { Component } from '@angular/core';
import * as models from "../../../../ApiModule/model/models";
import { InstructorsService } from "../../../../ApiModule";
import {from, mergeMap, of, delay, concatMap, switchMap, map} from 'rxjs'

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent {
  instructors!: Array<models.Instructor>;

  foo = from([1,2,3,4])

  constructor(private instructor_service: InstructorsService) {
    from([0,1,2,3,4]).pipe(
      concatMap((x) => of(x))
    ).subscribe(console.log)
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
