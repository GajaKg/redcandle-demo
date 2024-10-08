import {
  Component,
  computed,
  inject,
  ViewChild,
  effect,
} from '@angular/core';
import { CardComponent } from '../../../components/shared/card/card.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitleCardComponent } from '../../../components/shared/title-card/title-card.component';
import { ProductsStore } from '../../../store/products/products.store';
import Product from '../../../interfaces/product.interface';
import { ProductFormComponent } from '../../../components/product/product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CardComponent,
    ProductFormComponent,
    FormsModule,
    MatFormFieldModule,
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
  protected displayedColumns: string[] = ['id', 'product', 'amount', 'actions'];

  protected readonly products = computed(() =>
    this.storeProducts.products()
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

  onSubmit(product: any) {
    const name = product.name;
    const quantity = product.quantity;
    const id = this.products().length + 1;

    this.storeProducts.addProduct({ id: id, product: name, amount: quantity });
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
}
