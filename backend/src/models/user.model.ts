import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true 
    }

})

userSchema.pre("save", async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password as string, 8)
    }
})

const User = mongoose.model<UserType>("User", userSchema);

export default User;