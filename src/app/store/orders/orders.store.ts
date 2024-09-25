import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, tap } from 'rxjs';
import { ClientsStore } from '../clients/clients.store';
import Client from '../../interfaces/client.interface';
import { ProductsStore } from '../products/products.store';
import Product from '../../interfaces/product.interface';

type OrdersState = {
  orders: any[];
  isLoading: boolean;
  // selectedClientId: number | null;
};

const initialState: OrdersState = {
  orders: [
    {
      id: 1,
      clientId: 3,
      clientName: '',
      productId: 1,
      quantity: '1500',
      paid: true,
      date: '21.10.2024',
      dateDelivery: '30.10.2024',
      note: 'Neka napomena',
    },
    {
      id: 2,
      clientId: 3,
      clientName: '',
      productId: 2,
      quantity: '800',
      paid: true,
      date: '15.10.2024',
      dateDelivery: '22.10.2024',
      note: 'Neka napomena',
    },
    {
      id: 3,
      clientId: 2,
      clientName: '',
      productId: 3,
      quantity: '2000',
      paid: true,
      date: '15.09.2024',
      dateDelivery: '23.09.2024',
      note: '',
    },
    {
      id: 4,
      clientId: 1,
      clientName: '',
      productId: 2,
      quantity: '400',
      paid: true,
      date: '10.09.2024',
      dateDelivery: '22.09.2024',
      note: 'Neka napomena',
    },
    {
      id: 5,
      clientId: 1,
      clientName: '',
      productId: 2,
      quantity: '300',
      paid: true,
      date: '22.10.2024',
      dateDelivery: '11.11.2024',
      note: '',
    },
    {
      id: 6,
      clientId: 1,
      clientName: '',
      productId: 3,
      quantity: '2500',
      paid: true,
      date: '25.08.2024',
      dateDelivery: '30.08.2024',
      note: 'Neka napomena',
    },
  ],
  isLoading: false,
  // selectedClientId: null,
};

export const OrdersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => {
    return {
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
      allOrders: computed(() => {
        // const direction = filter.order() === 'asc' ? 1 : -1;
        return store.orders().map((order) => {
          const client = clientStore.clients().find((client: Client) => {
            return order.clientId == client.id;
          });
          const product = productStore.products().find((product: Product) => {
            return order.productId == product.id;
          });

          return {
            ...order,
            clientName: client?.name,
            productName: product?.product,
          };
        });
      }),
      ordersBySelectedClient: computed(() => {
        const orders = store.orders().filter((order) => {
          return order.clientId == clientStore.selectedClientId();
        });

        return orders.map((order) => {
          const client = clientStore.clients().find((client: Client) => {
            console.log(order.clientId, client.id)
            return order.clientId == client.id;
          });
          const product = productStore.products().find((product: Product) => {
            return order.productId == product.id;
          });

          return {
            ...order,
            clientName: client?.name,
            productName: product?.product,
          };
        });
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
