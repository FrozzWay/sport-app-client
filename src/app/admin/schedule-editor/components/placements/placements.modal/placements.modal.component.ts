import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Placement, PlacementsService } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PlacementViewModalComponent } from "../placement-view.modal/placement-view.modal.component";
import { placements } from "@popperjs/core";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-placements.modal-element',
  templateUrl: './placements.modal.component.html',
  styleUrls: ['../../categories/categories.modal/categories.modal.component.scss']
})
export class PlacementsModalComponent {
  @Input() placements!: Placement[]
  @Output() onUpdate: EventEmitter<any> = new EventEmitter();

  constructor(
    private placements_service: PlacementsService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.placements_service.getPlacements().subscribe(placements => {
      this.placements = placements
    })
  }

  edit_placement(placement: Placement) {
    const modalRef = this.modalService.open(PlacementViewModalComponent, {
      size: 'sm',
      centered: true
    })
    modalRef.componentInstance.placement = placement
    modalRef.result.then(result => {
      this.placements_service.updatePlacement(placement.name, result)
        .subscribe(result => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          const i = this.placements.indexOf(placement)
          this.placements[i] = result;
          this.onUpdate.emit(placement)
        })
    })
  }

  create_placement() {
    const modalRef = this.modalService.open(PlacementViewModalComponent, {
      size: 'sm',
      centered: true
    })
    modalRef.result.then(placement => {
      this.placements_service.createPlacement(placement)
        .subscribe(placement => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          this.placements.push(placement)
        })
    })
  }

  delete_placement(placement: Placement) {
    this.placements_service.deletePlacement(placement.name).subscribe({
      next: () => {
        this.snackBar.open('Помещение удалено', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
        this.placements = this.placements.filter(p => p != placement)
        this.onUpdate.emit(placement)
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.detail, 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

}
