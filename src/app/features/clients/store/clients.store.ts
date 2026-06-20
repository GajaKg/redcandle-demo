import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, DestroyRef, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom, lastValueFrom, pipe, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import Client from '@/features/clients/types/client.interface';
import { ClientService } from '@/features/clients/services/client.service';
import { SnackBarService } from '@/core/services/snackbar.service';

type ClientsState = {
  clients: Client[];
  activeClient: Client | null;
  isLoading: boolean;
  selectedClientId: number | null;
};

const initialState: ClientsState = {
  clients: [],
  activeClient: null,
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
      snackBar = inject(SnackBarService),
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
      // loadByQuery: rxMethod<string>(
      //   pipe(
      //     debounceTime(300),
      //     distinctUntilChanged(),
      //     tap(() => patchState(store, { isLoading: true })),
      //     switchMap((query) => {
      //       return clientService.fetchClients().pipe(
      //         tap({
      //           next: (books) =>
      //             patchState(store, { books, isLoading: false }),
      //           error: (err) => {
      //             patchState(store, { isLoading: false });
      //             console.error(err);
      //           },
      //         })
      //       );
      //     })
      //   )
      // ),
      async addClient(client: any) {
        // patchState(store, { isLoading: true });
        const response = await lastValueFrom(clientService.add(client));

        patchState(store, (state) => ({
          clients: [...state.clients, { ...response }],
        }));

        snackBar.success();
        // patchState(store, { isLoading: false });
      },
      async deleteClient(id: number) {
        await lastValueFrom(clientService.delete(id));

        patchState(store, (state) => ({
          clients: state.clients.filter((client) => {
            return client.id !== id;
          }),
        }));

        snackBar.success();
      },
      async editClient(client: Client) {
        await lastValueFrom(clientService.edit(client));

        patchState(store, (state) => ({
          clients: state.clients.map((clientEl) => {
            return clientEl.id === client.id ? client : clientEl;
          }),
        }));

        snackBar.success();
      },
      setSelectedClientId(id: number) {
        patchState(store, { selectedClientId: id });
      },
      async getClientById(id: number) {
        const client = await firstValueFrom(clientService.fetchClientById(id));

        patchState(store, { activeClient: client });
      },
    })
  ),

  withComputed((store) => ({
    getSelectedClient: computed(() => {
      const selectedId = store.selectedClientId();
      return store.clients().find((client) => client.id == selectedId);
    }),
  })),

  // withHooks({
  //   onInit(store) {
  //     store.getClients();
  //   }
  // })
);
function rxMethod<T>(arg0: any): any {
  throw new Error('Function not implemented.');
}

