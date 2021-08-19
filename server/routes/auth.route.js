const Router = require('express');
const User = require('../models/User');
const config = require('config')
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator')
const router = new Router()
const jwt = require('jsonwebtoken')

router.post('/registration',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Incorrect password').isLength({min: 3, max: 12}),

    ],
    async (req, res) => {
        try {
            console.log(req.body)
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Incorrect data',
                    errors
                })
            }
            const {email, password} = req.body;
            const candidate = await User.findOne({email})
            if (candidate) {
                return res.status(400).json({
                    message: `User with email ${email} already registered`
                })
            }
            const hashPassword = await bcrypt.hash(password, 15)
            const user = new User({email, password: hashPassword})
            await user.save()
            return res.json({
                message: `User with email ${email} was created`
            })

        } catch (err) {
            console.log(err);
            res.send({
                message: 'Server error'
            })
        }
    })

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }
        const isPassValid = await bcrypt.compare(password, user.password)
        if (!isPassValid) {
            return res.status(400).json({message: 'Password incorrect'})
        }
        const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: '1h'})
        return res.json({
            token,
            message: 'You have successfully login',
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace : user.usedSpace,
                avatar: user.avatar,
            }
        })

    } catch (err) {
        console.log(err);
        res.send({
            message: 'Server error'
        })
    }
})

module.exports = router