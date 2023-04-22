import { Component } from '@angular/core';
import { Client, ClientReportRow, ClientsService, Periods, ReportsService } from "src/ApiModule";
import { FormControl } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientReportViewModalComponent } from "../client-report-view.modal/client-report-view.modal.component";

@Component({
  selector: 'app-client-report-maker.modal-element',
  templateUrl: './client-report-maker.modal.component.html',
  styleUrls: ['../../categories/categories.modal/categories.modal.component.scss', './client-report-maker.modal.component.scss']
})
export class ClientReportMakerModalComponent {
  clients!: Client[]
  selected_client?: Client
  filtered_clients!: Client[]
  filterControl = new FormControl('')
  period: Periods = 'week'

  constructor(
    private client_service: ClientsService,
    private reports_service: ReportsService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) {}

  ngOnInit() {
    this.client_service.getClients().subscribe((c: any) => {
      this.clients = c
      this.filtered_clients = c
    })
    this.filterControl.valueChanges.subscribe(v => this._filter(v))
  }

  _filter(value: any) {
    if (typeof value != 'string') return
    const filterValue = value.toLowerCase();
    this.filtered_clients = this.clients.filter(client =>
      client.credentials.toLowerCase().includes(filterValue) ||
      client.phone.toLowerCase().includes(filterValue)
    )
  }

  make_report() {
    console.log(this.selected_client!.credentials)
    this.reports_service.getClientReport(this.selected_client!.id, this.period).subscribe(r => this.open_report(r))
  }

  open_report(r: ClientReportRow[]) {
    const parent = document.getElementsByClassName('client-report-maker').item(0)!
    parent.classList.remove('show')
    const modalRef = this.modalService.open(ClientReportViewModalComponent, {
      centered: true,
      scrollable: true
    })
    modalRef.componentInstance.report = r;
    modalRef.dismissed.subscribe(() => parent.classList.add('show'))
  }

  check_radio(id: number) {
    const radio = document.getElementById(`mat-client-radio-${id}-input`)! as HTMLInputElement
    radio.checked = true
  }
}
