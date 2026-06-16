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
import { SnackBarService } from '@/core/services/snackbar.service';

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
      snackbarService = inject(SnackBarService),
    ) => ({
      async getCategories() {
        const categories = await firstValueFrom(categoriesService.fetchCategories());

        patchState(store, (state) => ({
          categories: [...categories],
        }));
      },
      async postCategory(category: Partial<Category>) {
        const response = await firstValueFrom(categoriesService.post(category));

        patchState(store, (state) => ({
          categories: [...state.categories, response],
        }));

        snackbarService.success();
      }
    })
  ),
  // withComputed((store) => {
  //   // const productStore = inject(ProductsStore);
  // })

);
