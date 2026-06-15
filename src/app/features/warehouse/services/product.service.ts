import { NoToastMessage } from '@/core/constants/http.constants';
import { Category } from '@/features/categories/types/category.interface';
import { Product, ProductEdit } from '@/features/warehouse/types/product.interface';
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient)

  private readonly url = "/products"

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url, {
      context: new HttpContext().set(NoToastMessage, true)
    });
  }

  post(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  put(product: ProductEdit): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${product.id}`, product);
  }

  delete(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.url}/${id}`);
  }

}
