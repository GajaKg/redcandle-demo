import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDetailOrdersComponent } from '../../components/category-detail-orders/category-detail-orders.component';
import { CategoryDetailProductionComponent } from '../../components/category-detail-production/category-detail-production.component';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { Category } from '@/features/categories/types/category.interface';
import { Product } from '@/features/warehouse/types/product.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import { CardComponent } from '@/shared/components/card/card.component';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { CategoriesStore } from '../../store/categories.store';
import { Route } from '@/app.routes';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    CardComponent,
    // TitleCardComponent,
    FormsModule,
    MatListModule,
    MatIconModule,
    CategoryDetailOrdersComponent,
    CategoryDetailProductionComponent,
    MatFormField,
    MatLabel,
    MatInput,
    RouterLink
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _productStore = inject(ProductsStore);
  private readonly _categoriesStore = inject(CategoriesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected categoryId = signal<number>(0);
  editCategoryName = signal<boolean>(false);
  categoryName = "";

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroyRef),
      map(params => params['id']),
      distinctUntilChanged()
    ).subscribe(id => {
      if (id) {
        this._categoriesStore.fetchCategoryById(id);
      }
    });
  }

  constructor() {
    effect(() => {
      this.categoryName = this.category()?.name || "";
    })
  }

  protected readonly category: Signal<Category | null | undefined> = computed(() =>
    this._categoriesStore.activeCategory()
  );

  protected readonly ordersByCategory: Signal<Product[]> = computed(() =>
    this._productStore.findProductsByCategoryId(this.categoryId())
  );

  onEditCategory() {
    const name = this.categoryName.trim();
    if (!name || !this.category()) {
      alert("Naziv nije validan");
      return;
    }

    this._categoriesStore.editCategory(this.category()!.id, { name } satisfies Partial<Category>)
    this.editCategoryName.set(false);
  }

  onDeleteCategory() {
    if (!this.category()) return;
    this._categoriesStore.deleteCategory(this.category()!.id);
    this.router.navigate([Route.Production]);
  }


}
