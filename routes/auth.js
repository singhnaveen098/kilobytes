const express = require('express');
const router = express.Router();
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const JWT_secret = '@ssignm3n+d0n3'

//Route 1:
router.post('/signup', async (req, res) => {
    const { name, phone, password, role } = req.body
    try {
        let User = await user.findOne({ phone: phone })
        //check if user with same phone no. exists or not
        if (User) {
            return res.status(400).json({errors: 'A user with same phone no. exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(password, salt)
        User = await user.create({
            name: name,
            phone: phone,
            password: secpass,
            role: role
        })
        const data = {
            user: {
                id: User.id,
                role: User.role
            }
        }
        const authtoken = jwt.sign(data, JWT_secret);
        res.json({ authtoken: authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})


//Route 2:
//authenticate a user using post/api/auth/login. no login required
router.post('/login', async (req, res) => {
    const { phone, password } = req.body
    try {
        //finding user with given phone
        let User = await user.findOne({ phone: phone })
        if (!User) {
            return res.status(400).json({error: 'Please try to login with correct credentials' })
        }
        //comparing password
        const passcomp = await bcrypt.compare(password, User.password)
        if (!passcomp) {
            return res.status(400).json({error: 'Please try to login with correct credentials' })
        }
        const data = {
            user: {
                id: User.id,
                role: User.role
            }
        }
        const authtoken = jwt.sign(data, JWT_secret);
        res.json({authtoken: authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR')
    }
})


module.exports = router