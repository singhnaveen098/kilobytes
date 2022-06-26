const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/kilobyte?readPreference=primary&appname=MongoDB%20Compass&ssl=false'

const connectmongo = ()=>{
    mongoose.connect(uri, ()=>{
        console.log("Mongo Connected")
    })
}

module.exports = connectmongo