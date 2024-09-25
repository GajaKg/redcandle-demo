import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import Product from '../../interfaces/product.interface';
import { computed, inject } from '@angular/core';
import { OrdersStore } from '../orders/orders.store';
// import { Book } from './book.model';

type ProductsState = {
  products: Product[];
  isLoading: boolean;
  //   filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: ProductsState = {
  products: [
    { id: 1, product: 'Žižak', amount: 5000 },
    { id: 2, product: 'Čašice', amount: 5000 },
    { id: 3, product: 'Sveċe', amount: 5000 },
  ],
  isLoading: false,
  //   filter: { query: '', order: 'asc' },
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const orderStore = inject(OrdersStore);

    return {
      allProducts: computed(() => {
        return store.products().map((product: Product) => {
          // const filtered = orderStore.orders().filter(order => {
          //   return order.productId == product.id;
          // })
          // let amount = product.amount;
          orderStore.orders().forEach(order => {
            if (order.productId == product.id) {
              product.amount -= order.quantity;
            }
          })


        })

        // return store.orders().map((order) => {
        //   const client = clientStore.clients().find((client: Client) => {
        //     return order.clientId == client.id;
        //   });
        //   const product = productStore.products().find((product: Product) => {
        //     return order.productId == product.id;
        //   });

        //   return {
        //     ...order,
        //     clientName: client?.name,
        //     productName: product?.product,
        //   };
        // });
      }),
    }
    //     booksCount: computed(() => books().length),
    //     sortedBooks: computed(() => {
    //       const direction = filter.order() === 'asc' ? 1 : -1;
    //       return books().toSorted((a, b) =>
    //         direction * a.title.localeCompare(b.title)
    //       );
    //     }),
  }),
  withMethods((store) => ({
    addProduct(product: Product) {
      // patchState(store, { isLoading: true });
      patchState(store, (state) => ({
        products: [...state.products, product],
      }));
      // patchState(store, { isLoading: false });
    },
    deleteProduct(id: number) {
      const index = store.products().findIndex((el: Product) => el.id === id);
      store.products().splice(index, 1);

      patchState(store, (state) => ({
        products: [...state.products],
      }));
    },
    editProduct(product: Product) {
      const index = store
        .products()
        .findIndex((el: Product) => el.id === product.id);
      store.products()[index] = product;

      patchState(store, (state) => ({
        products: [...state.products],
      }));
    },
    // updateQuery(query: string): void {
    //   // 👇 Updating state using the `patchState` function.
    //   patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    // },
    // updateOrder(order: 'asc' | 'desc'): void {
    //   patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    // },
  }))
);
