import { Component, EventEmitter, Output } from '@angular/core';
import { CategoriesService, Category } from "src/ApiModule";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatIconRegistry } from "@angular/material/icon";
import { CategoryViewModalComponent } from "../category-view.modal/category-view.modal.component.";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-categories.modal-element',
  templateUrl: './categories.modal.component.html',
  styleUrls: ['./categories.modal.component.scss']
})
export class CategoriesModalComponent {
  categories!: Category[]
  @Output() onUpdate: EventEmitter<any> = new EventEmitter();
  constructor(
    private categories_service: CategoriesService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.categories_service.getCategories().subscribe(categories => this.categories = categories)
  }

  edit_category(category: Category) {
    const modalRef = this.modalService.open(CategoryViewModalComponent, {
      size: 'sm',
      centered: true
    })
    modalRef.componentInstance.category = category
    modalRef.result.then(result => {
      this.categories_service.updateCategory(category.name, result)
        .subscribe(result => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          const i = this.categories.indexOf(category)
          this.categories[i] = result
          this.onUpdate.emit(category)
        })
    })
  }

  create_category() {
    const modalRef = this.modalService.open(CategoryViewModalComponent, {
      size: 'sm',
      centered: true
    })
    modalRef.result.then(result => {
      this.categories_service.createCategory(result)
        .subscribe(result => {
          this.snackBar.open('Сохранено', 'Закрыть', { duration: 3000, verticalPosition: 'top' })
          this.categories.push(result)
        })
    })
  }

  delete_category(category: Category) {
    this.categories_service.deleteCategory(category.name).subscribe({
      next: () => {
        this.snackBar.open('Категория удалена', 'Закрыть', { duration: 3000, verticalPosition: 'top' });
        this.categories = this.categories.filter(c => c != category);
        this.onUpdate.emit(category)
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
