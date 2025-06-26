import mongoose from "mongoose";

const hotelSchema = mongoose.Schema({
    hotel_image: {
        type: String
    },
    hotel_name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    description: {
        type: String
    },
    amenities: {
        type: Array,
        default: ["Free Wi-Fi", "Swimming Pool", "24/7 Service", "Free Parking"]
    },
    instagram: {
        type: String
    },
    facebook: {
        type: String
    },
    twitter: {
        type: String
    }

}, { timestamps: true })

export default mongoose.model("Hotel", hotelSchema)