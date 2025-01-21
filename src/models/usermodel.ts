import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 4,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: Number,
        required: true,
        minlength: 10
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        unique: true
    },
});

const userModel = mongoose.model('users', userSchema);

export default userModel;