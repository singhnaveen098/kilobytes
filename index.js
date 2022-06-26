const express = require('express')
const cors = require('cors')
const app = express()
const connectmongo = require('./db')
const port = 3001

app.use(cors())

app.use(express.json())

connectmongo()

app.use('/auth', require('./routes/auth'))
app.use('/admin', require('./routes/admin'))
app.use('/driver', require('./routes/driver'))
app.use('/customer', require('./routes/customer'))
//response for wrong endpoints
app.use((req, res)=>{
    res.status(404).send({message:"Not Found"});
});

app.listen(port, ()=>{
    console.log(`Server conncted at http://localhost:${port}`)
})