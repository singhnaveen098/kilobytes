const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const user = require('../models/user');
const order = require('../models/order');
const item = require('../models/item');

//Api to see all orders
router.get('/getallorder', fetchuser, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json("Unauthorized access")
    }
    try {
        const mysort = { status: 1 }
        const data = await order.find().sort(mysort)
        res.json(data)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})

//Api to assign delivery person
router.post('/order/:orderid/driver/:driverid', fetchuser, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json("Unauthorized access")
    }
    try {
        let driver = await user.findById(req.params.driverid)
        if (!driver) { return res.status(404).send("Driver not found") }
        if (driver.role !== 'driver') { return res.status(400).send("This is not a driver id!!") }
        let Order = await order.findById(req.params.orderid)
        if (!Order) { return res.status(404).send("Order not found") }
        if (Order.status !== "Task created") { return res.status(400).send("Order is already processing.") }
        Order = await order.findByIdAndUpdate(req.params.orderid, { $set: { driverid: req.params.driverid, status: "Driver assigned" } })
        res.json({ message: "Delivery person assigned to the order." })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})

//Api to add item
router.post('/additem', fetchuser, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json("Unauthorized access")
    }
    const { name, category, addresses } = req.body
    try {
        let Item = await item.find({name: name})
        if (Item.length!==0) { return res.status(400).send("Item already exists.") }
        Item = await item.create({
            name,
            category,
            addresses
        })
        res.json({ message: "Item Created." })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})

module.exports = router