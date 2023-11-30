import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    message: {
        type: String,
        required: true
    }
});

export default mongoose.model('message', messageSchema);