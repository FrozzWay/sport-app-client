import { Component, Input } from '@angular/core';
import { Program } from "src/ApiModule";

@Component({
  selector: 'app-program-overview',
  templateUrl: './program-overview.component.html',
  styleUrls: ['./program-overview.component.scss']
})
export class ProgramOverviewComponent {
  @Input() program!: Program
}
