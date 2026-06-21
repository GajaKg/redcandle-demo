import { PagedResponse } from "@/core/types/response.types";
import { Order } from "../../orders/types/order.interface";

export default interface Client {
  id: number;
  name: string;
  address: string;
  contact: string;
  note?: string;
  orders?: PagedResponse<Order[]>
}
// export default interface Client {
//   id: number;
//   name: string;
//   address: string;
//   contact: string;
//   note?: string;
//   orders?: Order[]
// }
