import { ItemInterface } from "../../models/Item";
import { UserInterface } from "../../models/User";

export default function isLikeITems(items: any, user: UserInterface) {
    const checkItems = items.map((item: any) => {
        let isLikeItem = user.wishList.some(x => x.toString() === String(item._id));
        return { ...item._doc, isLikeItem }
    });
    return checkItems;
}