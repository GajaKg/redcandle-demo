import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Product, Production } from '../../interfaces/product.interface';
import { Order } from '../../interfaces/order.interface';
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
            return productEl.id === product.id
              ? {
                  ...product,
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
      addOrder(order: Partial<Order>) {
        patchState(store, (state) => ({
          products: state.products.map((product: Product) => {
            if (product.id === order.productId) {
              const quantity = order.delivered
                ? product.quantity - (order.quantity || 0)
                : product.quantity;
              return {
                ...product,
                quantity: quantity,
              };
            } else {
              return product;
            }
          }),
        }));

        patchState(store, (state) => ({
          orders: [...state.orders, order],
        }));
      },
      editOrder(
        order: Order,
        orderEditDiffQuantity: number,
        orderDeliveredOldValue: boolean
      ) {
        patchState(store, (state) => ({
          orders: state.orders.map((orderEl) => {
            return orderEl.id === order.id ? order : orderEl;
          }),
        }));
        patchState(store, (state) => ({
          products: state.products.map((product: Product) => {
            if (product.id === order.productId) {

              let reserved: number = !orderDeliveredOldValue
                ? product.reserved - (order.quantity + orderEditDiffQuantity)
                : product.reserved;
              let quantity: number = product.quantity + orderEditDiffQuantity;

              if (!order.delivered) {
                reserved = orderDeliveredOldValue
                  ? product.reserved + order.quantity
                  : product.reserved - orderEditDiffQuantity;
              }

              return {
                ...product,
                reserved: reserved,
                quantity: quantity,
              };
            } else {
              return product;
            }
          }),
        }));
      },
      deleteOrder(id: number) {
        let foundProduct: Product | undefined;

        const orders = store.orders().filter((orderEl: Order) => {
          if (orderEl.id !== id) {
            return true;
          } else {
            if (!orderEl.delivered) {
              foundProduct = store
                .products()
                .find((product: Product) => product.id === orderEl.productId);

              if (foundProduct) {
                foundProduct.quantity += orderEl.quantity;
                foundProduct.reserved -= orderEl.quantity;
              }
            }

            return false;
          }
        });

        patchState(store, (state) => ({
          orders: orders,
        }));

        if (foundProduct) {
          this.editProduct(foundProduct);
        }

        // patchState(store, (state) => ({
        //   orders: state.orders.filter((orderEl: any) => {
        //     return orderEl.id !== id;
        //   }),
        // }));
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
