export interface Production {
  date?: string | Date;
  quantity?: number;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  quantity: number;
  stockCapacity: number;
  reserved: number,
  production: Production[] | []
}