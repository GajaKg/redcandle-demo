export interface Production {
  date?: string | Date;
  quantity?: number;
}

export interface Product {
  id: number;
  product: string;
  amount: number;
  production: Production[] | []
}