import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import Client from '@/features/clients/types/client.interface';
import { Product } from '@/features/warehouse/types/product.interface';
import { Category } from '../types/category.interface';
import { firstValueFrom } from 'rxjs';
import { CategoriesService } from '../services/categories.service';

type CategoriesState = {
  categories: Category[];
  isLoading: boolean;
  // selectedClientId: number | null;
};

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
};

export const CategoriesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods(
    (
      store,
      categoriesService = inject(CategoriesService),
    ) => ({
      async getCategories() {
        const categories = await firstValueFrom(categoriesService.fetchCategories());

        patchState(store, (state) => ({
          categories: [...categories],
        }));
      }
    })
  ),
  // withComputed((store) => {
  //   // const productStore = inject(ProductsStore);
  // })

);
