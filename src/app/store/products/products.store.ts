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
import { ProductService } from '../../views/production/product.service';
import { forkJoin, map, tap } from 'rxjs';
import { OrderService } from '../../views/clients/order.service';

type ProductsState = {
  products: Product[];
  orders: any[];
  isLoading: boolean;
};

const initialState: ProductsState = {
  products: [],
  orders: [],
  isLoading: false,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      productService = inject(ProductService),
      orderService = inject(OrderService)
    ) => ({
      getProductsOrders() {
        forkJoin({
          products: productService.fetchProducts(),
          orders: orderService.fetchOrders(),
        })
          .pipe(
            tap(({ products, orders }) => {
              patchState(store, (state) => ({
                products: [...products],
              }));
              patchState(store, (state) => ({
                orders: [...orders],
              }));
            })
          )
          .subscribe();
      },
      addProduct(product: Product) {
        // patchState(store, { isLoading: true });
        patchState(store, (state) => ({
          products: [...state.products, product],
        }));
        // patchState(store, { isLoading: false });
      },
      deleteProduct(id: number) {
        patchState(store, (state) => ({
          products: state.products.filter((productEl: Product) => {
            return productEl.id !== id;
          }),
        }));
      },
      editProduct(product: Product) {
        patchState(store, (state) => ({
          products: state.products.map((productEl: Product) => {
            return productEl.id === product.id ? { ...product } : productEl;
          }),
        }));
      },
      findProductById(id: number) {
        return store.products().find((product: Product) => +product.id === +id);
      },
      addOrder(order: any) {
        patchState(store, (state) => ({
          products: state.products.map((product: Product) => {
            return product.id === order.productId
              ? { ...product, amount: product.amount - order.quantity || 0 }
              : product;
          }),
        }));

        patchState(store, (state) => ({
          orders: [...state.orders, order],
        }));
      },
      editOrder(order: any, productQuantity: number) {
        patchState(store, (state) => ({
          orders: state.orders.map((orderEl) => {
            return orderEl.id === order.id ? order : orderEl;
          }),
        }));
        patchState(store, (state) => ({
          products: state.products.map((product: Product) => {
            return product.id === order.productId
              ? { ...product, amount: productQuantity - order.quantity || 0 }
              : product;
          }),
        }));
      },
      deleteOrder(id: number) {
        patchState(store, (state) => ({
          orders: state.orders.filter((orderEl: any) => {
            return orderEl.id !== id;
          }),
        }));
      },
    })
  ),
  withComputed((store) => {
    const clientStore = inject(ClientsStore);

    return {
      // getProductsOrders: computed(() => {
      //   // let productCopy = store.products();
      //   // let productCopy = store.products().map(product => ({ ...product }));
      //   const productCopy = structuredClone(store.products());

      //   return productCopy.map((product: Product) => {
      //     store.orders().forEach((order) => {
      //       if (order.productId == product.id) {
      //         product.amount -= +order.quantity;
      //       }
      //     });
      //     return product;
      //   });
      // }),
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
