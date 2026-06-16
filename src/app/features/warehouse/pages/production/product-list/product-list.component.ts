import { Component, computed, inject, ViewChild, effect, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDialog,  } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFormComponent } from '@/features/warehouse/components/product-form/product-form.component';
import { TitleCardComponent } from '@/shared/components/title-card/title-card.component';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { Product, ProductEdit } from '@/features/warehouse/types/product.interface';
import { Route } from '@/app.routes';
import { CardComponent } from '@/shared/components/card/card.component';
import { CategoriesStore } from '@/features/categories/store/categories.store';
import { AddCategoryDialogComponent } from '@/features/categories/components/add-category-dialog/add-category-dialog.component';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CardComponent,
    ProductFormComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    TitleCardComponent,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    ProductFormComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  // private readonly formBuilder = inject(FormBuilder);
  private readonly productsStore = inject(ProductsStore);
  private readonly categoriesStore = inject(CategoriesStore);
  private readonly router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);

  protected displayedColumns: string[] = [
    'id',
    'product',
    'categoryName',
    'quantity',
    'stockCapacity',
    'actions',
  ];

  protected readonly products = computed(() => this.productsStore.products());
  protected readonly categories = computed(() =>
    this.categoriesStore.categories()
  );
  public dataSource = new MatTableDataSource<Product>(this.products());

  public editElement?: null | ProductEdit = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.products();
    });
  }

  ngOnInit() {
    this.productsStore.getProducts();
    this.categoriesStore.getCategories();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSubmit(product: Partial<Product>) {
    const name = product.name || '';
    const reserved = product.reserved || 0;
    const categoryId = product.categoryId;
    const quantity = product.quantity || 0;
    const stockCapacity = product.stockCapacity || 0;

    this.productsStore.addProduct({
      categoryId: categoryId,
      name: name,
      quantity: quantity,
      reserved: reserved,
      stockCapacity: stockCapacity,
    });
  }

  onDeleteProduct(id: number) {
    this.productsStore.deleteProduct(id);
  }

  onEditProduct(product: ProductEdit) {

    this.editElement = { ...product };
  }

  onEditProductConfirmed() {
    console.log("EDIT", this.editElement)
    if (this.editElement) {
      this.productsStore.editProduct({
        id: this.editElement.id,
        categoryId: this.editElement.categoryId,
        name: this.editElement.name,
        quantity: this.editElement.quantity,
        reserved: this.editElement.reserved,
        stockCapacity: this.editElement.stockCapacity,
      });
      this.editElement = null;
    }
  }

  onCancel() {
    this.editElement = null;
  }

  navigate(productId: number) {
    this.router.navigate([Route.Product, productId], {
      relativeTo: this.activatedRoute,
    });
  }

  navigateToCategory(categoryId: number) {
    this.router.navigate([
      `${Route.Categories}/${Route.CategoryDetail}`,
      categoryId,
    ]);
  }

  openAddCategory() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
