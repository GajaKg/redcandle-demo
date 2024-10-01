import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import Product from '../../interfaces/product.interface';
import { computed, inject } from '@angular/core';
import { ClientsStore } from '../clients/clients.store';
import Client from '../../interfaces/client.interface';

type ProductsState = {
  products: Product[];
  orders: any[];
  isLoading: boolean;
};

const initialState: ProductsState = {
  products: [
    { id: 1, product: 'Žižak', amount: 5000 },
    { id: 2, product: 'Čašice', amount: 5000 },
    { id: 3, product: 'Sveċe', amount: 5000 },
  ],
  orders: [
    {
      id: 1,
      clientId: 3,
      clientName: '',
      productId: 1,
      quantity: 1500,
      paid: true,
      date: '21.10.2024',
      dateDelivery: '30.10.2024',
      delivered: true,
      note: 'Neka napomena',
    },
    {
      id: 2,
      clientId: 3,
      clientName: '',
      productId: 2,
      quantity: 800,
      paid: true,
      date: '15.10.2024',
      dateDelivery: '22.10.2024',
      delivered: true,
      note: 'Neka napomena',
    },
    {
      id: 3,
      clientId: 2,
      clientName: '',
      productId: 3,
      quantity: 2000,
      paid: true,
      date: '15.09.2024',
      dateDelivery: '23.09.2024',
      delivered: false,
      note: '',
    },
    {
      id: 4,
      clientId: 1,
      clientName: '',
      productId: 2,
      quantity: 400,
      paid: true,
      date: '10.09.2024',
      dateDelivery: '22.09.2024',
      delivered: false,
      note: 'Neka napomena',
    },
    {
      id: 5,
      clientId: 4,
      clientName: '',
      productId: 2,
      quantity: 300,
      paid: true,
      date: '22.10.2024',
      dateDelivery: '11.11.2024',
      delivered: true,
      note: '',
    },
    {
      id: 6,
      clientId: 1,
      clientName: '',
      productId: 3,
      quantity: 2500,
      paid: true,
      date: '25.08.2024',
      dateDelivery: '30.08.2024',
      delivered: false,
      note: 'Neka napomena',
    },
  ],
  isLoading: false,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
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
    addOrder(order: any) {
      patchState(store, (state) => ({
        orders: [...state.orders, order],
      }));
    },
  })),
  withComputed((store) => {
    const clientStore = inject(ClientsStore);

    return {
      allProducts: computed(() => {
        // let productCopy = store.products();
        // let productCopy = store.products().map(product => ({ ...product }));
        const productCopy = structuredClone(store.products())
   
        return productCopy.map((product: Product) => {
          store.orders().forEach(order => {
            if (order.productId == product.id) {
              product.amount -= +order.quantity;
            }
          })
          return product;
        })
      }),
      allOrders: computed(() => {
        return store.orders().map((order) => {
          const client = clientStore.clients().find((client: Client) => {
            return order.clientId == client.id;
          });
          const product = store.products().find((product: Product) => {
            return order.productId == product.id;
          });
          // console.log(order)

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
            return order.clientId == client.id;
          });
          const product = store.products().find((product: Product) => {
            return order.productId == product.id;
          });

          return {
            ...order,
            clientName: client?.name,
            productName: product?.product,
          };
        });
      }),
    };
  })
);
