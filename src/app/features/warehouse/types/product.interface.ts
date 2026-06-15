export interface Production {
  date?: string | Date;
  quantity?: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  categoryId?: number;
  quantity: number;
  stockCapacity: number;
  reserved: number,
  production: Production[] | []
}

export interface ProductEdit extends Omit<Product, "category" | "production"> { };
