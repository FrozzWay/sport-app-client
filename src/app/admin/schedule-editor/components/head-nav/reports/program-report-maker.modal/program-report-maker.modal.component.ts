import { Component } from '@angular/core';
import { Periods, Program, ProgramsService, ReportsService } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";
import { ProgramViewModalComponent } from "../../programs/program-view.modal/program-view.modal.component";

@Component({
  selector: 'app-program-report-maker.modal-element',
  templateUrl: './program-report-maker.modal.component.html',
  styleUrls: ['../../categories/categories.modal/categories.modal.component.scss', './program-report-maker.modal.component.scss']
})
export class ProgramReportMakerModalComponent {
  programs!: Program[]
  selected_programs: Set<Program> = new Set();
  filtered_programs?: Program[]
  filterControl = new FormControl();
  period?: Periods


  constructor(
    private programs_service: ProgramsService,
    private reports_service: ReportsService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,

  ) {}

  ngOnInit() {
    this.programs_service.getAllPrograms().subscribe(p => {
      this.programs = p
      this.filtered_programs = p
    })
    this.filterControl.valueChanges.subscribe(value => this._filter(value))
  }

  _filter(value: any) {
    if (typeof value != 'string') return
    const filterValue = value.toLowerCase();
    this.filtered_programs = this.programs.filter(program =>
      program.name.toLowerCase().includes(filterValue) ||
      program.instructor.credentials.toLowerCase().includes(filterValue)
    )
  }

  check_program(program: Program) {
    this.selected_programs?.has(program) ?
      this.selected_programs.delete(program) : this.selected_programs.add(program)
  }

  open_program(program: Program) {
    const modalRef = this.modalService.open(ProgramViewModalComponent, {
      centered: true,
      modalDialogClass: 'modal-dialog-resized-m'
    })
    modalRef.componentInstance.program = program
    modalRef.componentInstance.hideAction = true
  }

  check_all() {
    this.selected_programs.size > 0 ?
      this.selected_programs.clear() : this.selected_programs = new Set(this.programs)
  }

  make_report() {
    console.log(this.period)
    this.reports_service.getProgramsReport({
      programs: Array.from(this.selected_programs!).map(p => p.id),
      period: this.period!
    }).subscribe()
  }
}
