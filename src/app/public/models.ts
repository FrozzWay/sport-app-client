import * as models from "../../ApiModule/model/models";

export interface periods {
  [hour: number] : {
    days: {
      [day: string]:  models.ScheduleRecord[]
    },
    filled?: boolean
  }
}

export interface Schedule {
  current_week: periods,
  next_week: periods
}

export interface Filters {
  programs: Map<number, string>,
  instructors: Map<number, string>,
  categories: Set<string>,
  placements: Set<string>
}
