import { Component, Input } from '@angular/core';
import { map, Observable, startWith } from "rxjs";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent {
  @Input() display_property!: any;
  @Input() options!: Array<any> | null;
  @Input() placeholder!: string;
  @Input() formControl = new FormControl<string | any>('');
  @Input() width?: string;
  @Input() required: boolean = true;
  filteredOptions!: Observable<any>;
  displayFn: any;

  ngOnChanges() {
    if (this.options == null) return
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const val = typeof value === 'string' ? value : value[this.display_property];
        // @ts-ignore
        return val ? this._filter(val as string) : this.options.slice();
      })
    );
    let f = this.display_property
    this.displayFn = function (option: any, field: any = f): string {
      return option && option[field] ? option[field] : '';
    }
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    // @ts-ignore
    return this.options.filter((option: any) =>
      option[this.display_property].toLowerCase().includes(filterValue)
    );
  }
}
