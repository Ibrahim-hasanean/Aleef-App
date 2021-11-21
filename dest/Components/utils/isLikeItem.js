"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLikeITems(items, user) {
    const checkItems = items.map((item) => {
        let isLikeItem = user.wishList.some(x => x.toString() === String(item._id));
        return Object.assign(Object.assign({}, item._doc), { isLikeItem });
    });
    return checkItems;
}
exports.default = isLikeITems;
