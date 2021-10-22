import { ObjectId } from "mongoose";
import Item, { ItemInterface } from "../../models/Item";
import { OrdersItemsInterface } from "../../models/OrderItems";

export default async function caculateItemsPrice(orderItems: OrdersItemsInterface[]) {
    let shippingCost = 0;
    let itemsCost = 0;
    for (let i = 0; i < orderItems.length; i++) {
        const orderItem: OrdersItemsInterface = orderItems[i];
        let itemId = orderItem.item as ObjectId;
        const item = await Item.findById(itemId);
        let itemShippingCost = Number(item.shippingPrice) * Number(orderItem.count);
        let itemCost = Number(item.price) * Number(orderItem.count);
        shippingCost = itemShippingCost + shippingCost;
        itemsCost = itemCost + itemsCost;
    };

    // orderItems.forEach(async orderItem => {
    //     let itemId = orderItem.item as ObjectId;
    //     const item = await Item.findById(itemId);
    //     let itemShippingCost = Number(item.shippingPrice) * Number(orderItem.count);
    //     let itemCost = Number(item.price) * Number(orderItem.count);
    //     shippingCost = itemShippingCost + shippingCost;
    //     itemsCost = itemCost + itemsCost;
    // });
    return { shippingCost, itemsCost, totalCost: itemsCost + shippingCost };
}