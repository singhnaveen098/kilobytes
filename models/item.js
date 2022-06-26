const mongoose = require('mongoose')
const { Schema } = mongoose;

const itemschema = new Schema({
    name : { type: String, required: true},
    category : { type: String, required: true},
    addresses : [{ type: String, required:true }]
}, {timestamps:true})

const item = mongoose.model('item', itemschema)
module.exports = item