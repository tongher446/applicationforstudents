import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, required: false, default: "user"},

    resetToken: { type: String },
    resetTokenExpiry: { type: Number },
})

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;