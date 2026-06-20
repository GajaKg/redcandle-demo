import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import Client from '@/features/clients/types/client.interface';
import { Product } from '@/features/warehouse/types/product.interface';
import { Order } from '@/features/orders/types/order.interface';
import { ClientsStore } from '@/features/clients/store/clients.store';
import { OrderService } from '../services/order.service';
import { firstValueFrom } from 'rxjs';
import { SnackBarService } from '@/core/services/snackbar.service';

type OrdersState = {
  orders: Order[];
  activeOrder: Order | null
  isLoading: boolean;
  // selectedClientId: number | null;
};

const initialState: OrdersState = {
  orders: [],
  activeOrder: null,
  isLoading: false,
  // selectedClientId: null,
};

export const OrdersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((
    store,
    orderService = inject(OrderService),
    snackbarService = inject(SnackBarService),
  ) => {
    return {
      async fetchOrders() {
        const response = await firstValueFrom(orderService.fetchOrders());
        console.log(response)
        patchState(store, (state) => ({
          orders: response,
        }));
        // patchState(store, { isLoading: false });
        snackbarService.success();
      },
      async getOrderById(id: number) {
        const response = await firstValueFrom(orderService.fetchById(id));
        console.log(response)
        patchState(store, (state) => ({
          activeOrder: response,
        }));
        // patchState(store, { isLoading: false });
        snackbarService.success();
      },
      // connectCriteria: rxMethod<Criteria>((c$) => c$.pipe(
      //     filter(c => c.from.length >= 3 && c.to.length >= 3),
      //     debounceTime(300),
      //     switchMap((c) => flightService.find(c.from, c.to)),
      //     tap(flights => patchState(state, { flights }))
      //   ))
    };
  }),

  withComputed((store) => {
    const clientStore = inject(ClientsStore);
    const productStore = inject(ProductsStore);

    return {
      getActiveOrder: computed(() => store.activeOrder()),
      allOrders: computed(() => {
        // const direction = filter.order() === 'asc' ? 1 : -1;
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
      ordersBySelectedClient: computed(() => {
        // const orders = store.orders().filter((order) => {
        //   return order.clientId == clientStore.selectedClientId();
        // });

        // return orders.map((order) => {
        //   const client = clientStore.clients().find((client: Client) => {
        //     console.log(order.clientId, client.id)
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
      // allOrders: rxMethod<any>((c$) => c$.pipe(
      //     tap(orders => {
      //         console.log(orders)
      //     })
      //   ))
    };

    //   getSelectedClient: computed(() => {
    //     const selectedId = store.selectedClientId();
    //     return store.Orders().find(client => client.id == selectedId);
    //   }),
    //   booksCount: computed(() => books().length),
    //   sortedBooks: computed(() => {
    //     const direction = filter.order() === 'asc' ? 1 : -1;
    //     return books().toSorted((a, b) =>
    //       direction * a.title.localeCompare(b.title)
    //     );
    //   }),
  })
  //   withHooks({
  //     onInit() {
  //         allOrders();
  //     },
  //   })
);
