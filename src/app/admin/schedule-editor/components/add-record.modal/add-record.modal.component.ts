import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CategoriesService, Category, Instructor,
  InstructorsService, Placement,
  PlacementsService,
  Program,
  ProgramsService,
  Schema
} from "src/ApiModule";
import { FormBuilder, FormControl } from "@angular/forms";
import * as utils from "src/time-utils";
import IMask from 'imask';
import { Observable, concatMap } from "rxjs";
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
    category: [''],
    placement: [''],
    instructor: [''],
    place_limit: [''],
    registration_opens: ['']
  })
  enable_registration: boolean = true
  paid: boolean = false


  weekdays = new Set<number>()
  programs!: Program[]
  categories?: Category[]
  placements?: Placement[]
  instructors?: Instructor[]
  program?: Program
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

  week_days: Date[] = []

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private program_service: ProgramsService,
    private category_service: CategoriesService,
    private placement_service: PlacementsService,
    private instructor_service: InstructorsService,
    iconRegistry: MatIconRegistry,
  ) {
    iconRegistry.registerFontClassAlias('mat-icon-filled', 'material-font-filled mat-ligature-font');
  }

  ngOnInit() {
    utils.add_days(this.week_days, false)
    this.program_service.getAllPrograms().subscribe((programs) => {
        this.programs = programs;
        this.program = (programs.length > 0) ? programs[0] : undefined
    })
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
    })
  }

  onDayClick(day_: Date) {
    const day = day_.getUTCDay()
    if (this.weekdays.has(day)) {
      this.weekdays.delete(day)
      document.getElementById(`day_${day}`)!.classList.remove('selected_day')
    }
    else {
      this.weekdays.add(day)
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


}
