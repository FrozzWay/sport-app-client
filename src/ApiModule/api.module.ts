import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './api/auth.service';
import { CategoriesService } from './api/categories.service';
import { ClientsService } from './api/clients.service';
import { InstructorsService } from './api/instructors.service';
import { PlacementsService } from './api/placements.service';
import { ProgramsService } from './api/programs.service';
import { RecordsService } from './api/records.service';
import { ReportsService } from './api/reports.service';
import { ScheduleService } from './api/schedule.service';
import { ScheduleSchemasService } from './api/scheduleSchemas.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
