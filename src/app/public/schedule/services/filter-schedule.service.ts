import { Injectable } from '@angular/core';
import { Filters } from "../../models";
import { ScheduleRecord, SchemaRecord } from "src/ApiModule";

@Injectable({
  providedIn: 'root'
})
export class FilterScheduleService {
  filters!: Filters
  constructor() { this.cleanup_filters() }

  cleanup_filters() {
    this.filters = {
      programs: new Map<number, string>(),
      instructors: new Map<number, string>(),
      categories: new Set<string>(),
      placements: new Set<string>()
    }
  }

  classify_for_filters(collection: ScheduleRecord[] | SchemaRecord[]) {
    collection.forEach((record) => {
      let program = record.program
      this.filters.categories.add(program.category.name)
      this.filters.instructors.set(program.instructor.id, record.program.instructor.credentials)
      this.filters.placements.add(program.placement.name)
      this.filters.programs.set(program.id,program.name)
    })
  }

  filter_schedule(
    collection: ScheduleRecord[] | SchemaRecord[],
    filters: any
  ) {
    // @ts-ignore
    let schedule = Array.from(collection)
    if (filters.programs.size > 0)
      schedule = schedule.filter(record => filters.programs.has(record.program.name))
    if (filters.instructors.size > 0)
      schedule = schedule.filter(record => filters.instructors.has(record.program.instructor.id))
    if (filters.categories.size > 0)
      schedule = schedule.filter(record => filters.categories.has(record.program.category.name))
    if (filters.placements.size > 0)
      schedule = schedule.filter(record => filters.placements.has(record.program.placement.name))
    if (!filters.paid)
      schedule = schedule.filter(record => !record.program.paid)
    if (!filters.available_registration)
      schedule = schedule.filter(record => !record.program.available_registration)
    return schedule as any
  }
}
