import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, DestroyRef, inject } from '@angular/core';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import Client from '@/features/clients/types/client.interface';
import { ClientService } from '@/features/clients/services/client.service';

type ClientsState = {
  clients: Client[];
  isLoading: boolean;
  selectedClientId: number | null;
};

const initialState: ClientsState = {
  clients: [],
  isLoading: false,
  selectedClientId: null,
};

export const ClientsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods(
    (
      store,
      clientService = inject(ClientService),
      destroyRef = inject(DestroyRef)
    ) => ({
      getClients() {
        clientService
          .fetchClients()
          .pipe(
            takeUntilDestroyed(destroyRef),
            tap((clients: Client[]) => {
              patchState(store, (state) => ({
                clients: [...clients],
              }));
            }),
          )
          .subscribe();
      },
      addClient(client: Client) {
        // patchState(store, { isLoading: true });

        patchState(store, (state) => ({
          clients: [...state.clients, client],
        }));
        // patchState(store, { isLoading: false });
      },
      deleteClient(id: number) {
        patchState(store, (state) => ({
          clients: state.clients.filter((client) => {
            return client.id !== id;
          }),
        }));
      },
      editClient(client: Client) {
        patchState(store, (state) => ({
          clients: state.clients.map((clientEl) => {
            return clientEl.id === client.id ? client : clientEl;
          }),
        }));
      },
      setSelectedClientId(id: number) {
        patchState(store, { selectedClientId: id });
      },
    })
  ),

  withComputed((store) => ({
    getSelectedClient: computed(() => {
      const selectedId = store.selectedClientId();
      return store.clients().find((client) => client.id == selectedId);
    }),
  }))
);
