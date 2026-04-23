import { Component, computed, inject, ViewChild, effect, ChangeDetectionStrategy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '@/core/components/shared/card/card.component';
import { ProductFormComponent } from '@/features/warehouse/components/product-form/product-form.component';
import { TitleCardComponent } from '@/core/components/shared/title-card/title-card.component';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { Product } from '@/features/warehouse/types/product.interface';
import { Route } from '@/app.routes';



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
export class ProductListComponent {
  // private readonly formBuilder = inject(FormBuilder);
  private readonly storeProducts = inject(ProductsStore);
  private readonly router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  protected displayedColumns: string[] = [
    'id',
    'product',
    'categoryName',
    'quantity',
    'stockCapacity',
    'actions',
  ];

  protected readonly products = computed(() => this.storeProducts.products());
  protected readonly categories = computed(() =>
    this.storeProducts.categories()
  );
  public dataSource = new MatTableDataSource<Product>(this.products());

  public editElement?: null | Product = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.products();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSubmit(product: Partial<Product>) {
    const name = product.name || '';
    const reserved = product.reserved || 0;
    const categoryId = product.categoryId || 0;
    const quantity = product.quantity || 0;
    const stockCapacity = product.stockCapacity || 0;
    const id = this.products().length + 1;

    this.storeProducts.addProduct({
      id: id,
      categoryId: categoryId,
      name: name,
      quantity: quantity,
      reserved: reserved,
      stockCapacity: stockCapacity,
      production: [],
    });
  }

  onDeleteProduct(id: number) {
    this.storeProducts.deleteProduct(id);
  }

  onEditProduct(product: Product) {
    this.editElement = { ...product };
  }

  onEditProductConfirmed() {
    if (this.editElement) {
      this.storeProducts.editProduct(this.editElement);
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
}
