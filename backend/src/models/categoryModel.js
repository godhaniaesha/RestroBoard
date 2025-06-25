import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    category_image: {
        type: String
    },
    category_name: {
        type: String
    },
    category_description: {
        type: String
    }

}, { timestamps: true })

export default mongoose.model("Category", categorySchema)