import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 4,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        unique: true
    },
    
});

const adminModel = mongoose.model('admin', adminSchema);
export default adminModel;