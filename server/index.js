const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require("path");
const app = express()
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.route')
const PORT = config.get('serverPort');
const cors = require('cors')
const corsMiddleware = require('./middlewares/cors.middleware')


app.use(cors())
// app.use(corsMiddleware)
app.use(express.json())
app.use('/api/auth', authRouter)



const startServer = async () => {
    try {
        await mongoose.connect(config.get('uri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => {
            console.log(`server listening on port ${PORT}`)
        })
    } catch (err) {
        throw new Error(err)
    }
}

startServer()