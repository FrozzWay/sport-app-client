import * as models from "../../ApiModule/model/models";

export interface periods_ScheduleRecord {
  [hour: number] : {
    days: {
      [day: string]:  models.ScheduleRecord[]
    },
    filled?: boolean
  }
}

export interface Schedule {
  current_week: periods_ScheduleRecord,
  next_week: periods_ScheduleRecord
}

export interface Filters {
  programs: Map<number, string>,
  instructors: Map<number, string>,
  categories: Set<string>,
  placements: Set<string>
}
