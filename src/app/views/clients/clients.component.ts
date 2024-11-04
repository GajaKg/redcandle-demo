import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { CardComponent } from '../../components/shared/card/card.component';
import { TitleCardComponent } from '../../components/shared/title-card/title-card.component';
import { ClientFormComponent } from '../../components/client/client-form/client-form.component';

import Client from '../../interfaces/client.interface';
import { Route } from '../../app.routes';
import { ClientsStore } from '../../store/clients/clients.store';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TitleCardComponent,
    CardComponent,
    ClientFormComponent,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent implements AfterViewInit {
  private router = inject(Router);
  private storeClients = inject(ClientsStore);

  protected displayedColumns: string[] = [
    'id',
    'name',
    'address',
    'contact',
    'note',
    'actions',
  ];

  protected clients = computed(() => this.storeClients.clients());
  dataSource = new MatTableDataSource<Client>(this.clients());

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public editElement: Client | null = null;

  constructor() {
    effect(() => {
      this.dataSource.data = this.clients();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSubmit(client: any) {
    const id = this.clients().length + randomIntFromInterval(10, 100);
    // const id = this.clients().length + 1;
    // const id: unique symbol = Symbol(client.name);
    this.storeClients.addClient({ id, ...client });
  }

  onDeleteClient(id: number) {
    this.storeClients.deleteClient(id);
  }

  onEditClient(client: Client) {
    this.editElement = { ...client };
  }

  onEditClientConfirmed() {
    if (this.editElement) {
      this.storeClients.editClient(this.editElement);
      this.editElement = null;
    }
  }

  onCancel() {
    this.editElement = null;
  }

  navigate(clientId: number) {
    this.router.navigate([Route.ClientDetail, clientId]);
  }
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}