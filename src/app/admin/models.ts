import * as models from 'src/ApiModule/model/models';


export interface ScheduleSchemas {
  active?: models.Schema,
  next_week?: models.Schema
}

export interface ApiRecords {
  active?: models.SchemaRecord[],
  next_week?: models.SchemaRecord[],
  custom?: models.SchemaRecord[],
}

export interface periods_SchemaRecord {
  [hour: number] : {
    days: {
      [day: string]:  models.SchemaRecord[]
    },
    filled?: boolean
  }
}

export interface SchemaRecords {
  current_week: periods_SchemaRecord,
  next_week: periods_SchemaRecord,
  custom: periods_SchemaRecord,
}

export interface Filters {
  programs: Map<number, string>,
  instructors: Map<number, string>,
  categories: Set<string>,
  placements: Set<string>
}
