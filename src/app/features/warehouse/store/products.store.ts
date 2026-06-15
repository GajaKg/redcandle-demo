import { OrderService } from '@/features/clients/services/order.service';
import { Order } from '@/features/clients/types/order.interface';
import { Product, ProductEdit } from '@/features/warehouse/types/product.interface';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { first, firstValueFrom, forkJoin, lastValueFrom, map, tap } from 'rxjs';
import { ProductService } from '../services/product.service';
import { ClientsStore } from '@/features/clients/store/clients.store';
import Client from '@/features/clients/types/client.interface';
import { Category } from '@/features/categories/types/category.interface';
import { SnackBarService } from '@/core/services/snackbar.service';
import { CategoriesService } from '@/features/categories/services/categories.service';



type ProductsState = {
  products: Product[] | any;
  orders: Order[] | Partial<Order>[] | any;
  categories: Category[];
  selectedProductId: number | null;
  isLoading: boolean;
};

const initialState: ProductsState = {
  products: [],
  orders: [],
  categories: [],
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
      categoriesService = inject(CategoriesService),
      snackbarService = inject(SnackBarService),
    ) => ({
      async getProducts() {
        const products = await firstValueFrom(productService.fetchProducts());
        const categories = await firstValueFrom(categoriesService.fetchCategories());

        patchState(store, (state) => ({
          products: [...products],
          categories: [...categories],
        }));
        // proveri treba da postoji toSignal()
        // return forkJoin({
        //   categories: productService.fetchCategories(),
        //   products: productService.fetchProducts(),
        //   orders: orderService.fetchOrders(),
        // }).pipe(
        //   map(({ products, orders, categories }) => {
        //     const ordersMapped = orders.map((order: Order) => {
        //       const product = products.find(
        //         (product: Product) => order.productId == product.id
        //       );
        //       const client = clientStore
        //         .clients()
        //         .find((client: Client) => order.clientId == client.id);

        //       return {
        //         ...order,
        //         clientName: client?.name,
        //         productName: product?.name,
        //       };
        //     });

        //     const productsMapped = products.map((product: Product) => {
        //       const category = categories.find(
        //         (cat) => cat.id == product.categoryId
        //       );
        //       return {
        //         ...product,
        //         categoryName: category?.name,
        //       };
        //     });

        //     return { productsMapped, ordersMapped, categories };
        //   }),
        //   tap(({ productsMapped, ordersMapped, categories }) => {
        //     // @TODO remove after adding backend
        //     if (store.products().length) return;
        //     patchState(store, (state) => ({
        //       products: [...productsMapped],
        //     }));
        //     patchState(store, (state) => ({
        //       orders: [...ordersMapped],
        //     }));
        //     patchState(store, (state) => ({
        //       categories: [...categories],
        //     }));
        //   })
        // );
      },
      async addProduct(product: Partial<Product>) {
        const response = await firstValueFrom(productService.post(product));
        console.log(response)
        patchState(store, (state) => ({
          products: [...state.products, response],
        }));
        // patchState(store, { isLoading: false });
        snackbarService.success();
      },
      async editProduct(product: ProductEdit) {
        const response = await firstValueFrom(productService.put(product))

        patchState(store, (state) => ({
          products: state.products.map((productEl: Product) => {
            return productEl.id === product.id
              ? {
                ...response,
              }
              : productEl;
          }),
        }));

        snackbarService.success();
      },
      async deleteProduct(id: number) {
        const response = await firstValueFrom(productService.delete(id));

        patchState(store, (state) => ({
          products: state.products.filter((productEl: Product) => {
            return productEl.id !== id;
          }),
        }));

        snackbarService.success();
      },
      findProductById(id: number) {
        return store.products().find((product: Product) => +product.id === +id);
      },
      findProductsByCategoryId(id: number): Product[] {
        // @TODO ovo treba da se sredi categoryId
        // return store.products().filter((product: Product) => +product.categoryId === +id);
        return store.products().filter((product: Product) => +product.id === +id);
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
                // productName: p.name,
                quantity: quantity,
              };
            } else {
              return {
                ...product,
                // productName: p.name,
              };
            }
          }),
        }));
        //@TODO remove after backend
        const p = this.findProductById(+order.productId!);
        patchState(store, (state) => ({
          orders: [{ ...order, productName: p.name }, ...state.orders],
        }));
      },
      editOrder(
        order: Order,
        orderEditDiffQuantity: number,
        orderDeliveredOldValue: boolean
      ) {
        //@TODO remove after backend
        const p = this.findProductById(+order.productId!);
        patchState(store, (state) => ({
          orders: state.orders.map((orderEl: Order) => {
            return orderEl.id === order.id ? { ...order, productName: p.name } : orderEl;
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
      findOrdersByCategoryId(id: number): Order[] {
        return store.orders().filter((order: Order) => +order.categoryId === +id);
      },
      findCategoryById(id: number): Category | undefined {
        return store.categories().find((category: Category) => +category.id === +id);
      },
    })
  ),
  withComputed((store) => {
    const clientStore = inject(ClientsStore);

    return {
      selectedProduct: computed<Product | undefined>(() => {
        return store
          .products()
          .find((product: Product) => product.id == store.selectedProductId());
      }),
      selectedProductOrders: computed(() => {
        return store
          .orders()
          .filter(
            (order: Order) => order.productId == store.selectedProductId()
          );
      }),
      ordersBySelectedClient: computed(() => {
        return store
          .orders()
          .filter(
            (order: Order) => order.clientId == clientStore.selectedClientId()
          );
      }),
    };
  })
);
