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
  @Input() options!: Array<any>;
  @Input() placeholder!: string;
  @Input() formControl = new FormControl<string | any>('');
  @Input() width?: string;
  filteredOptions!: Observable<any>;
  displayFn: any;

  ngOnInit() {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value[this.display_property];
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
    this.formControl.valueChanges.subscribe((v) => console.log('p'))
    let f = this.display_property
    this.displayFn = function (option: any, field: any = f): string {
      return option && option[field] ? option[field] : '';
    }
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
