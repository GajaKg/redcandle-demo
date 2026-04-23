import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CardComponent } from '@/core/components/shared/card/card.component';
import { CategoryDetailOrdersComponent } from '../../components/category-detail-orders/category-detail-orders.component';
import { CategoryDetailProductionComponent } from '../../components/category-detail-production/category-detail-production.component';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { Category } from '@/features/categories/types/category.interface';
import { Product } from '@/features/warehouse/types/product.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    CardComponent,
    // TitleCardComponent,
    MatListModule,
    MatIconModule,
    RouterLink,
    CategoryDetailOrdersComponent,
    CategoryDetailProductionComponent
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _productStore = inject(ProductsStore);
  private readonly route = inject(ActivatedRoute);
  protected categoryId = signal<number>(0);

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroyRef),
      map(params => params['id']),
      distinctUntilChanged()
    ).subscribe(id => {
      if (id) {
        this.categoryId.set(id);
      }
    });
  }

  protected readonly category: Signal<Category | undefined> = computed(() =>
    this._productStore.findCategoryById(this.categoryId())
  );

  protected readonly productsByCategory: Signal<Product[]> = computed(() =>
    this._productStore.findProductsByCategoryId(this.categoryId())
  );

  protected readonly ordersByCategory: Signal<Product[]> = computed(() =>
    this._productStore.findProductsByCategoryId(this.categoryId())
  );

}
