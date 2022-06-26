const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const order = require('../models/order');

const sttable = {
    "Task created":1,
    "Driver assigned":2,
    "Reached Store":3,
    "Items Picked":4,
    "Enroute":5,
    "Delivered":6,
    "Canceled":7
}

//api to show all status
router.get('/getallstatus', fetchuser, async (req, res) => {
    if (req.user.role !== "driver") {
        return res.status(401).json("Unauthorized access")
    }
    try {
        res.json(Object.keys(sttable))
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})

//api to update status of order
router.post('/updatestatus/:orderid', fetchuser, async(req, res)=>{
    if (req.user.role !== "driver") {
        return res.status(401).json("Unauthorized access")
    }
    const { status } = req.body
    try {
        let Order = await order.findById(req.params.orderid)
        if (!Order) { return res.status(404).send("Order not found") }
        if (sttable[Order.status] > sttable[status]) { return res.status(400).send("Order status is already ahead of given status.") }
        if (sttable[Order.status] === sttable[status]) { return res.status(400).send("Order status is already updated.") }
        if (!Object.keys(sttable).includes(status)){ return res.status(404).send("Invalid status!!") }
        Order = await order.findByIdAndUpdate(req.params.orderid, { $set:{status: status}})
        res.json({message: "Order status updated"})
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})


module.exports = router