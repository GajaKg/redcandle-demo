import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import Client from '../../interfaces/client.interface';
import { computed } from '@angular/core';

type ClientsState = {
  clients: Client[];
  isLoading: boolean;
  selectedClientId: number | null;
};

const initialState: ClientsState = {
  clients: [
    {
      id: 1,
      name: 'Konami',
      address: 'Pere Bozica',
      contact: '063 666 555',
      note: 'Neka napomena',
    },
    {
      id: 2,
      name: 'Sony',
      address: 'Dusana Kecmana 20',
      contact: '064 888 76 69',
      note: '',
    },
    {
      id: 3,
      name: 'Nitendo',
      address: 'Milosa Teodosica 11',
      contact: '034 784 777',
      note: '',
    },
    {
      id: 4,
      name: 'xBox',
      address: 'Bogdana Bogdanovica 104',
      contact: '011 121 2 452',
      note: '',
    },
  ],
  isLoading: false,
  selectedClientId: null,
};

export const ClientsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    addClient(client: Client) {
      // patchState(store, { isLoading: true });
      patchState(store, (state) => ({
        clients: [...state.clients, client],
      }));
      // patchState(store, { isLoading: false });
    },
    deleteClient(id: number) {
      const index = store.clients().findIndex((el: Client) => el.id === id);
      store.clients().splice(index, 1);

      patchState(store, (state) => ({
        clients: [...state.clients],
      }));
    },
    editClient(client: Client) {
      const index = store
        .clients()
        .findIndex((el: Client) => el.id === client.id);
      store.clients()[index] = client;

      patchState(store, (state) => ({
        clients: [...state.clients],
      }));
    },
    setSelectedClientId(id: number) {
      patchState(store, { selectedClientId: id });
    },
  })),

  withComputed((store) => ({
    getSelectedClient: computed(() => {
      const selectedId = store.selectedClientId();
      return store.clients().find(client => client.id == selectedId);
    }),
  }))
);
