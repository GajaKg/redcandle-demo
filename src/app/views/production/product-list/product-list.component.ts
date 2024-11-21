import { Component, computed, inject, ViewChild, effect } from '@angular/core';
import { CardComponent } from '../../../components/shared/card/card.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitleCardComponent } from '../../../components/shared/title-card/title-card.component';
import { ProductsStore } from '../../../store/products/products.store';
import { Product } from '../../../interfaces/product.interface';
import { ProductFormComponent } from '../../../components/product/product-form/product-form.component';
import { Route } from '../../../app.routes';
import { ActivatedRoute, Router } from '@angular/router';

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
})
export class ProductListComponent {
  // private readonly formBuilder = inject(FormBuilder);
  private readonly storeProducts = inject(ProductsStore);
  private router = inject(Router);
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
  protected readonly categories = computed(() => this.storeProducts.categories());
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
}
