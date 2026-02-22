import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false,
    },
    role: {
        type: String,
        enum: ['Patient', 'Guardian', 'Doctor'],
        required: true,
    },
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
    },
    phone: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
