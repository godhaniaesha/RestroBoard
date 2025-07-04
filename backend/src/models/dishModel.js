import mongoose from "mongoose";

const dishSchema = mongoose.Schema({
    dish_image: {
        type: String
    },
    dish_name: {
        type: String
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    price: {
        type: String
    },
    badge_Tag: {
        type: String,
        enum: ["Best Seller", "chef's Choice", "Most Loved", "South Indian Special", "Most Ordered", "Snack Star", "Vegetarian Delight", "Tandoor Special", "Punjabi Favorite"]
    },
    description: {
        type: String
    },
    rating: {
        type: String
    }
}, { timestamps: true })

export default mongoose.model("Dish", dishSchema)