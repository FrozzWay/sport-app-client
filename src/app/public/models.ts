import * as models from "../../ApiModule/model/models";

export interface periods {
  [hour: number] : {
    dates: {
      [date: string]:  models.ScheduleRecord[]
    },
    filled?: boolean
  }
}

export interface Schedule {
  current_week: periods,
  next_week: periods
}
