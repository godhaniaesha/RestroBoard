import mongoose from "mongoose";

const leaveSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "register",
        required: true
    },
    emp_name: {
        type: String
    },
    leave_type: {
        type: String,
        enum: ["Sick Leave", "Causal Leave", "Emergency Leave"]
    },
    start_date: {
        type: Date
    },
    start_time: {
        type: String
    },
    end_date: {
        type: Date
    },
    end_time: {
        type: String
    },
    leave_reason: {
        type: String
    },
    leave_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected','cancelled'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "register"
    },
    approvedByRole: {
        type: String
    }
}, { timestamps: true })

export default mongoose.model("Leave", leaveSchema)