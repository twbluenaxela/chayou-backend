const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const logger = require('./utils/logger')
const config = require('./utils/config')
const teaRouter = require('./controllers/tea')
const middleware = require('./utils/middleware')

const app = express();

logger.info(`Connecting to ${config.MONGODB_URI}`)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/tea', teaRouter)

// if(process.env.NODE_ENV === 'testing'){

// }

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;