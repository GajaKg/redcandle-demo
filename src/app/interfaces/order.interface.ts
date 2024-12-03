
export interface Order {
  id: number;
  clientId: number;
  clientName: string;
  productId: number;
  categoryId: number;
  quantity: number,
  paid: boolean,
  date: Date | string,
  dateDelivery: Date | string,
  delivered: boolean,
  note: string,
}