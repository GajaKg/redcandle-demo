import { Order } from '../interfaces/order.interface';

export function extractChartDataOrdersForMultipleProducts(orders: Order[]) {
  const myMap: any = {};

  orders.forEach((order: any) => {
    const date = new Date(order.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const productName = order.productName;

    if (myMap.hasOwnProperty(productName)) {
      if (myMap.hasOwnProperty(year)) {
        if (myMap[productName][year].hasOwnProperty(month)) {
          myMap[productName][year][month] += order.quantity;
        } else {
          myMap[productName][year][month] = order.quantity;
        }
      } else {
        myMap[productName][year] = new Array(12).fill(0);
        myMap[productName][year][month] = order.quantity;
      }
    } else {
      myMap[productName] = {};;
      myMap[productName][year] = new Array(12).fill(0);
      myMap[productName][year][month] = order.quantity;
    }
  });

  return myMap;
}

export function extractChartDataOrdersForSingleProduct(orders: Order[]) {
    const myMap: any = {};

    orders.forEach((order: any) => {
      const date = new Date(order.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (myMap.hasOwnProperty(year)) {
        if (myMap[year].hasOwnProperty(month)) {
          myMap[year][month] += order.quantity;
        } else {
          myMap[year][month] = order.quantity;
        }
      } else {
        myMap[year] = new Array(12).fill(0);
        myMap[year][month] = order.quantity;
      }

    });
    return myMap;
}
