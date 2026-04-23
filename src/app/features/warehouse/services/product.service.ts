import { Category } from '@/features/categories/types/category.interface';
import { Product } from '@/features/warehouse/types/product.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient)

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('data/products.json');
  }

  fetchCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('data/categories.json');
  }
}
