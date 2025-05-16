import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { 
        type: String,
        required: [true, 'Nama wajib diisi']
    },
    email: { 
        type: String,
        required: [true, 'Email wajib diisi'],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email tidak valid']
    },
    password: { 
        type: String,
        required: [true, 'Password wajib diisi'],
        minlength: [8, 'Password minimal 8 karakter']
    },
    phone: { 
        type: String,
        default: ''
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const User = mongoose.model('User', UserSchema);
export default User;