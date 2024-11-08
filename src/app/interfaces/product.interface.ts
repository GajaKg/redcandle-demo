export interface Production {
  date?: string | Date;
  quantity?: number;
}

export interface Product {
  id: number;
  product: string;
  quantity: number;
  stockCapacity: number;
  reserved: number,
  production: Production[] | []
}