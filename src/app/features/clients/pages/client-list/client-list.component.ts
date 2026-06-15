import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { TitleCardComponent } from '@/shared/components/title-card/title-card.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { ClientsStore } from '../../store/clients.store';
import Client from '@/features/clients/types/client.interface';
import { Route } from '@/app.routes';
import { CardComponent } from '@/shared/components/card/card.component';


@Component({
  selector: 'app-client-list',
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
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent implements AfterViewInit, OnInit {
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
    // throw new Error('This is a test error!');
    effect(() => {
      this.dataSource.data = this.clients();
    });
  }

  ngOnInit() {
    this.storeClients.getClients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSubmit(client: Client) {
    this.storeClients.addClient(client);
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
