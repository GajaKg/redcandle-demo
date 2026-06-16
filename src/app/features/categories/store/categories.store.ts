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
import { first, firstValueFrom } from 'rxjs';
import { CategoriesService } from '../services/categories.service';
import { SnackBarService } from '@/core/services/snackbar.service';

type CategoriesState = {
  categories: Category[];
  activeCategory: Category | null,
  isLoading: boolean;
  // selectedClientId: number | null;
};

const initialState: CategoriesState = {
  categories: [],
  activeCategory: null,
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
        console.log("POST CAT", response)
        patchState(store, (state) => ({
          categories: [...state.categories, response],
        }));

        snackbarService.success();
      },
      async editCategory(id: number, category: Partial<Category>) {
        const response = await firstValueFrom(categoriesService.put(id, category));

        patchState(store, (state) => ({
          categories: [...state.categories, response],
        }));

        snackbarService.success();
      },
      async deleteCategory(id: number) {
        await firstValueFrom(categoriesService.delete(id));

        patchState(store, (state) => ({
          categories: [...state.categories.filter((category) => {
            return category.id != id ? category : null;
          })],
        }));

        snackbarService.success();
      },
      getCategoryById(id: number) {
        return store.categories().find((category: Category) => +category.id === +id);
      },
      async fetchCategoryById(id: number) {
        const response = await firstValueFrom(categoriesService.fetchCategoryById(id));
        console.log("FETCHED CATEGORY", response)
        patchState(store, (state) => ({
          activeCategory: response,
        }));
        // return store.categories().find((category: Category) => +category.id === +id);
      }
    })
  ),
  // withComputed((store) => {
  //   // const productStore = inject(ProductsStore);
  // })

);
