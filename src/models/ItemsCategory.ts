import mongoose, { Schema, ObjectId } from "mongoose";

export interface ItemsCategoryInterface extends mongoose.Document {
    name: string
}


const itemsCategorySchema = new Schema({
    name: { type: String, required: true },
})

const ItemsCategory = mongoose.model("itemsCategory", itemsCategorySchema);

export default ItemsCategory;

