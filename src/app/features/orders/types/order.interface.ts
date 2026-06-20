import { Product } from "@/features/warehouse/types/product.interface";

export interface Order {
  id: number;
  paid: boolean,
  date: Date | string,
  delivered: boolean,
  note: string,
  orderProducts: Product[]
}
