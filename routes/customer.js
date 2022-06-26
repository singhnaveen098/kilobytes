const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const order = require('../models/order');
const item = require('../models/item');

//Api to see all items
router.get('/getallitems', fetchuser, async (req, res) => {
    if (req.user.role !== "customer") {
        return res.status(401).json("Unauthorized access")
    }
    try {
        const mysort = { name: 1 }
        const data = await item.find().sort(mysort)
        res.json(data)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})

//Api to create order
router.post('/createorder', fetchuser, async (req, res) => {
    if (req.user.role !== "customer") {
        return res.status(401).json("Unauthorized access")
    }
    const {items} = req.body
    try {
        let Order = await order.create({
            items: [],
            custid: req.user.id,
            pickloc: []
        })
        for(let i=0; i<items.length; i++){
            let Item = await item.find({name: items[i].name})
            if(Item.length === 0){
                Order  = await order.findByIdAndDelete(Order.id)
                return res.status(404).send("Items not available!!!! create another order with available items.")
            }
            Order = await order.findByIdAndUpdate(Order.id, {
                $push: {
                    items: items[i],
                    pickloc: Item[0].addresses[0]
                }
            })
        }
        res.json({message: "Order created"})
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})

module.exports = router