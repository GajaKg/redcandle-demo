import { Product } from "@/features/warehouse/types/product.interface";

export interface Category {
  id: number;
  name: string;
  products?: Product[]
}
