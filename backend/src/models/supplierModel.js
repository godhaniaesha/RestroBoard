import mongoose from "mongoose";

const supplierSchema = mongoose.Schema({
    supplyer_image: {
        type: String
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    whatsapp_number: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    address: {
        type: String,
    },
    ingredients_supplied: {
        type: [String],
        default: [],
    },
    role: {
        type: String,
        default: "supplyer"
    }
}, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema); 