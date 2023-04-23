import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Filters } from "../../../models";
import { FormControl } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterPanelComponent {
  @Output() onFilterSchedule: EventEmitter<any> = new EventEmitter();
  @Input() filters!: Filters
  @Input() hideCheckBoxes = false
  applied_filters = {
    programs: new Set<string>(),
    instructors: new Set<number>(),
    categories: new Set<string>(),
    placements: new Set<string>(),
    paid: true,
    available_registration: true,
  }

  placements = new FormControl('')
  categories = new FormControl('')
  instructors = new FormControl('')
  programs = new FormControl('')

  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.registerFontClassAlias('mat-icon-filled', 'material-font-filled mat-ligature-font');
  }

  dropFormControls() {
    this.placements.setValue(null)
    this.categories.setValue(null)
    this.instructors.setValue(null)
    this.programs.setValue(null)
  }

  ngOnInit() {
    this.categories.valueChanges.subscribe(
      (val) => { // @ts-ignore
        this.applied_filters.categories = new Set(val);
        this.onFilterSchedule.emit(this.applied_filters);
      });
    this.instructors.valueChanges.subscribe(
      (val) => { // @ts-ignore
        this.applied_filters.instructors = new Set(val);
        this.onFilterSchedule.emit(this.applied_filters);
      });
    this.placements.valueChanges.subscribe(
      (val) => { // @ts-ignore
        this.applied_filters.placements = new Set(val);
        this.onFilterSchedule.emit(this.applied_filters);
      });
    this.programs.valueChanges.subscribe(
      (val) => { // @ts-ignore
        this.applied_filters.programs = new Set(val);
        this.onFilterSchedule.emit(this.applied_filters);
      });
  }

  paidOnChange() {
    this.applied_filters.paid = !this.applied_filters.paid
    this.onFilterSchedule.emit(this.applied_filters)
  }

  registrationOnChange() {
    this.applied_filters.available_registration = !this.applied_filters.available_registration
    this.onFilterSchedule.emit(this.applied_filters)
  }
}
