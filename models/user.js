const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
}, {timestamps:true});

const user = mongoose.model('user', userSchema)
module.exports = user