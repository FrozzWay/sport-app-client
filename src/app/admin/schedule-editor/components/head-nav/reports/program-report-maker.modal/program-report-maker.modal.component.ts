import { Component, ElementRef, ViewChild } from '@angular/core';
import { Periods, Program, ProgramsReportResponse, ProgramsService, ReportsService } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";
import { ProgramViewModalComponent } from "../../programs/program-view.modal/program-view.modal.component";
import { ProgramReportViewModalComponent } from "../program-report-view.modal/program-report-view.modal.component";

@Component({
  selector: 'app-program-report-maker.modal-element',
  templateUrl: './program-report-maker.modal.component.html',
  styleUrls: ['../../categories/categories.modal/categories.modal.component.scss', './program-report-maker.modal.component.scss']
})
export class ProgramReportMakerModalComponent {
  @ViewChild('checker') checker!: ElementRef
  programs!: Program[]
  selected_programs: Set<Program> = new Set();
  filtered_programs?: Program[]
  filterControl = new FormControl();
  period?: Periods = 'week'
  all_checked: boolean = false


  constructor(
    private programs_service: ProgramsService,
    private reports_service: ReportsService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,

  ) {}

  ngOnInit() {
    this.programs_service.getAllPrograms().subscribe(p => {
      p = p.filter(p => p.available_registration)
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
    this.all_checked = (this.selected_programs.size == this.programs.length)
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
    if (this.selected_programs.size > 0) {
      this.selected_programs.clear();
      setTimeout(() => this.all_checked = false, 1)
    }
    else {
      this.selected_programs = new Set(this.programs)
      this.all_checked = true
    }
  }

  make_report() {
    this.reports_service.getProgramsReport({
      programs: Array.from(this.selected_programs!).map(p => p.id),
      period: this.period!
    }).subscribe(r => this.open_report(r))
  }

  open_report(r: ProgramsReportResponse) {
    const parent = document.getElementsByClassName('program-report-maker').item(0)!
    parent.classList.remove('show')
    const modalRef = this.modalService.open(ProgramReportViewModalComponent, {
      centered: true,
      scrollable: true
    })
    modalRef.componentInstance.report = r;
    modalRef.dismissed.subscribe(() => parent.classList.add('show'))
  }
}
