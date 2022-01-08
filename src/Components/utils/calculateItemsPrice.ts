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
        if (!item) throw new Error(`can not pay items, item with id  ${itemId} not found`);
        if (item.avaliableQuantity <= 0) throw new Error(`this item ${itemId} is out of stock`);
        if (item.avaliableQuantity < orderItem.count) throw new Error(`this item is out of stock`);
        let itemShippingCost = Number(item.shippingPrice) * Number(orderItem.count);
        let itemCost = Number(item.price) * Number(orderItem.count);
        shippingCost = itemShippingCost + shippingCost;
        itemsCost = itemCost + itemsCost;
        item.avaliableQuantity = item.avaliableQuantity - (1 * orderItem.count);
        item.soldQuantity = item.soldQuantity + (1 * orderItem.count);
        await item.save();
    };

    return { shippingCost, itemsCost, totalCost: itemsCost + shippingCost };
}