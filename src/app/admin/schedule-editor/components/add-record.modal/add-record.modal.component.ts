import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CategoriesService, Category,
  Instructor, InstructorsService,
  Placement, PlacementsService,
  Program, CreateProgram, ProgramsService,
  Schema, SchemaRecord, RecordsService, ScheduleSchemasService, SchemaRecordCreate
} from "src/ApiModule";
import { FormBuilder, FormControl } from "@angular/forms";
import * as utils from "src/time-utils";
import IMask from 'imask';
import { forkJoin, concatMap, Observable } from "rxjs";
import { MatIconRegistry } from "@angular/material/icon";
import { MatExpansionPanel } from "@angular/material/expansion";

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.modal.component.html',
  styleUrls: ['./add-record.modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddRecordModalComponent {
  @Input() schema!: Schema
  @ViewChild('program_creation_panel') program_creation_panel!: MatExpansionPanel;
  programCreation_pbar_shown: boolean = false
  daytimeControl = new FormControl('');
  durationControl = new FormControl('');
  programControl = new FormControl('');
  programCreationForm = this.fb.group({
    name: [''],
    category: [''],
    placement: [''],
    instructor: [''],
    place_limit: [''],
    registration_opens: ['']
  })
  enable_registration: boolean = true
  paid: boolean = false


  selected_weekdays = new Set<number>()
  weekdays: Date[] = []

  // querying
  programs!: Program[]
  categories?: Category[]
  placements?: Placement[]
  instructors?: Instructor[]

  // select [auto-select]
  program?: Program
  instructor?: Instructor
  //
  onCreateProgram: boolean = false
  isSelectedProgram: boolean = false
  daytime_mask = {
    mask: 'HH:MM',
    blocks: {
      HH: {
        mask: IMask.MaskedRange,
        placeholderChar: 'HH',
        from: 0,
        to: 23,
        maxLength: 2
      },
      MM: {
        mask: IMask.MaskedRange,
        placeholderChar: 'MM',
        from: 0,
        to: 59,
        maxLength: 2
      }
    }
  }
  duration_mask = {mask: Number, min: 5, max: 720}
  added_records?: SchemaRecord[]

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private program_service: ProgramsService,
    private category_service: CategoriesService,
    private placement_service: PlacementsService,
    private instructor_service: InstructorsService,
    private record_service: RecordsService,
    private schema_service: ScheduleSchemasService,
    iconRegistry: MatIconRegistry,
  ) {
    iconRegistry.registerFontClassAlias('mat-icon-filled', 'material-font-filled mat-ligature-font');
  }

  ngOnInit() {
    // querying
    utils.add_days(this.weekdays, false)
    this.program_service.getAllPrograms().subscribe((programs) => {
        this.programs = programs;
        this.program = (programs.length > 0) ? programs[0] : undefined
    })
    // autocomplete controls
    this.programControl.valueChanges.subscribe((program) => {
      if (typeof program != 'string' && program) {
        this.program = program
        this.isSelectedProgram = true;
        document.getElementById('program-desc')?.classList.remove('opacity-50')
      }
      else {
        this.isSelectedProgram = false;
        document.getElementById('program-desc')?.classList.add('opacity-50')
      }
      this.programCreationForm.controls.instructor.valueChanges.subscribe((instructor) =>
          this.instructor = (typeof instructor != 'string' && instructor) ? instructor : undefined
      )
    })
  }

  onDayClick(day_: Date) {
    const day = day_.getUTCDay()
    if (this.selected_weekdays.has(day)) {
      this.selected_weekdays.delete(day)
      document.getElementById(`day_${day}`)!.classList.remove('selected_day')
    }
    else {
      this.selected_weekdays.add(day)
      document.getElementById(`day_${day}`)!.classList.add('selected_day')
    }
  }

  toggleProgramCreation() {
    if (this.instructors) {
      this.toggleProgramCreation_after();
      return
    }
    this.programCreation_pbar_shown = true
    this.category_service.getCategories().pipe(concatMap(value => {
      this.categories = value;
      return this.placement_service.getPlacements();
    })).pipe(concatMap(value => {
      this.placements = value;
      return this.instructor_service.getInstructors();
    })).subscribe(instructors => {
      this.instructors = instructors;
      this.programCreation_pbar_shown = false;
      this.toggleProgramCreation_after()
    })
  }

  toggleProgramCreation_after() {
    this.onCreateProgram = !this.onCreateProgram
    this.programControl.disabled ? this.programControl.enable() : this.programControl.disable()
    this.program_creation_panel.toggle()
    setTimeout(() => this.enable_registration = !this.enable_registration)
    if (this.isSelectedProgram)
      setTimeout(() => document.getElementById('program-desc')?.classList.remove('opacity-50'))
  }

  openNewModal() {
    let parent = document.getElementsByClassName('windowClass').item(0)!
    parent.classList.remove('show')
    const childModalRef = this.modalService.open(AddRecordModalComponent, {
      backdrop: false
    })
    childModalRef.closed.subscribe(() => parent.classList.add('show'))
  }


  isReadyToAdd() {
    const daytime = this.daytimeControl.value
    const duration = this.durationControl.value
    const record_params = Boolean(daytime && duration && this.selected_weekdays.size > 0 && daytime.length == 5)
    if (!record_params) return false
    if (this.isSelectedProgram && !this.onCreateProgram) return true
    if (this.onCreateProgram) {
      const name = this.programCreationForm.controls.name.value
      const category = this.programCreationForm.controls.category.value
      const placement = this.programCreationForm.controls.placement.value
      return (name && category && placement && this.instructor)
    }
    return false
  }

  onAddRecord() {
    if (!this.onCreateProgram) {
      let records = this.add_records(this.program!)
      this.include_records_in_schema(records)
      return
    }
    let program: CreateProgram = {
      name: this.programCreationForm.controls.name.value!,
      category: this.programCreationForm.controls.category.value!,
      placement: this.programCreationForm.controls.placement.value!,
      instructor: this.instructor!.id,
      paid: this.paid,
    }
    if (this.enable_registration) {
      const place_limit = this.programCreationForm.controls.place_limit.value;
      const registration_opens = this.programCreationForm.controls.registration_opens.value;
      program['available_registration'] = true
      program['place_limit'] = place_limit ? +place_limit : undefined
      program['registration_opens'] = registration_opens ? +registration_opens : undefined
    }

    this.program_service.createProgram(program).subscribe(program => {
      let records = this.add_records(program)
      this.include_records_in_schema(records)
    })
  }

  add_records(program: Program): Observable<SchemaRecord[]> {
    let records = [...this.selected_weekdays].map(day => this.add_record(day, program))
    return forkJoin(records)
  }

  add_record(day: number, program: Program): Observable<SchemaRecord> {
    const record: SchemaRecordCreate = {
      program: program,
      day_time: this.daytimeControl.value!,
      duration: +this.durationControl.value!,
      week_day: day,
    }
    return this.record_service.createRecord(record)
  }

  include_records_in_schema(records: Observable<SchemaRecord[]>) {
    records.pipe(concatMap(records => {
      this.added_records = records
      let records_id = records.map(record => record.id)
      return this.schema_service.includeRecordsInSchema(this.schema.id, records_id)
    })).subscribe(
      // snackbar message
      // output event
    )
  }

}
