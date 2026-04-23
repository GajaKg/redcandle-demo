import { createReducer, on } from '@ngrx/store';
import { fetchProducts } from './products.actions';

export const initialState = {
    products: [
        { id: 1, product: 'Žižak', quantity: 1009 },
        { id: 2, product: 'Čašice', quantity: 426 },
        { id: 3, product: 'Sveċe', quantity: 691 },
    ],
    clients: []
};

export const productsReducer = createReducer(
  initialState,
  on(fetchProducts, (state) => {
    console.log("fetched", state);
    return state;
  }),
//   on(decrement, (state) => state - 1),
//   on(reset, (state) => 0)
);