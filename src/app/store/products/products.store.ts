import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Product, Production } from '../../interfaces/product.interface';
import { computed, inject } from '@angular/core';
import { ClientsStore } from '../clients/clients.store';
import Client from '../../interfaces/client.interface';
import { ProductService } from '../../views/production/product.service';
import { forkJoin, tap } from 'rxjs';
import { OrderService } from '../../views/clients/order.service';

type ProductsState = {
  products: Product[];
  orders: any[];
  selectedProductId: number | null;
  isLoading: boolean;
};

const initialState: ProductsState = {
  products: [],
  orders: [],
  selectedProductId: null,
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
        return forkJoin({
          products: productService.fetchProducts(),
          orders: orderService.fetchOrders(),
        }).pipe(
          tap(({ products, orders }) => {
            // @TODO remove after adding backend
            if (store.products().length) return;

            patchState(store, (state) => ({
              products: [...products],
            }));
            patchState(store, (state) => ({
              orders: [...orders],
            }));
          })
        );
        // .subscribe();
      },
      addProduct(product: Product) {
        // patchState(store, { isLoading: true });
        patchState(store, (state) => ({
          products: [...state.products, product],
        }));
        // patchState(store, { isLoading: false });
      },
      addProduction(productId: number, developed: Production) {
        patchState(store, (state) => ({
          products: state.products.map((productEl: Product) => {
            return productEl.id == +productId
              ? {
                  ...productEl,
                  amount: productEl.amount + +developed.quantity! || 0,
                  production: [...productEl.production, developed],
                }
              : productEl;
          }),
        }));
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
            const orders = state.orders.filter((orderEl) => orderEl.productId == product.id)
            const sumProduction = product.production.reduce((total, object) => total + object.quantity!, 0);
            const sumProductOrders = orders.reduce((total, object) => total + object.quantity!, 0);

            return productEl.id === product.id
              ? {
                  ...product,
                  amount:  +sumProduction - +sumProductOrders,
                  production: [...product.production],
                }
              : productEl;
          }),
        }));
      },
      findProductById(id: number) {
        return store.products().find((product: Product) => +product.id === +id);
      },
      setSelectedProductId(id: number) {
        patchState(store, { selectedProductId: id });
      },
      addOrder(order: any) {
        patchState(store, (state) => ({
          products: state.products.map((product: Product) => {
            return product.id === order.productId
              ? { ...product, amount: product.amount - order.quantity }
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
      selectedProduct: computed<Product | undefined>(() => {
        return store
          .products()
          .find((product: Product) => product.id == store.selectedProductId());
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
