const mongoose = require('mongoose')
const { Schema } = mongoose;

const orderschema = new Schema({
    items : [{name:{ type: String, required:true }, qty:{ type: Number, required:true, default: 1 }}],
    driverid : {type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    status : { type: String, default:"Task created"},
    custid : {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    pickloc : [{ type: String, required: true}]
}, {timestamps:true})

const order = mongoose.model('order', orderschema)
module.exports = order