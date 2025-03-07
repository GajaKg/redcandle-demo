import { Routes } from '@angular/router';
import { ClientsComponent } from './views/clients/clients.component';
import { ProductionComponent } from './views/production/production.component';
import { ProductListComponent } from './views/production/product-list/product-list.component';
import { ProductDetailComponent } from './views/production/product-detail/product-detail.component';
import { ClientDetailComponent } from './views/clients/client-detail/client-detail.component';
import { CategoriesComponent } from './views/categories/categories.component';
import { CategoryDetailComponent } from './views/categories/category-detail/category-detail.component';

export enum Route {
  Clients = 'clients',
  ClientDetail = 'client-detail',
  Production = 'production',
  ProductList = 'product-list',
  Categories = 'categories',
  CategoryDetail = 'category-detail',
  Product = 'product',
  Signup = 'signup',
}

export const routes: Routes = [
  {
    path: Route.Clients,
    component: ClientsComponent,
    // canActivate: [() => inject(GuardService).canActivateScheduler()]
  },
  {
    path: Route.ClientDetail + '/:id',
    component: ClientDetailComponent,
    // canActivate: [() => inject(GuardService).canActivateScheduler()]
  },
  {
    path: Route.Production,
    component: ProductionComponent,
    // canActivate: [() => inject(GuardService).canActivateScheduler()]
    children: [
      {
        path: '',
        component: ProductListComponent,
        // canActivate: [() => inject(GuardService).canActivateScheduler()]
      },
      {
        path: Route.Product + '/:id',
        component: ProductDetailComponent,
        // canActivate: [() => inject(GuardService).canActivateScheduler()]
      },
    ],
  },
  {
    path:`${Route.Categories}/${Route.CategoryDetail}` + '/:id',
    component: CategoryDetailComponent,
  },
  // {
  //   path: Route.Categories,
  //   component: CategoriesComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: CategoriesComponent,
  //     },
  //     {
  //       path: Route.CategoryDetail + '/:id',
  //       component: CategoryDetailComponent,
  //     },
  //   ],
  // },
];
