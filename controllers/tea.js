const teaRouter = require('express').Router()
const Tea = require('../models/tea')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

teaRouter.get('/', async(request, response) => {
    logger.info("Hello!")
    const teaList = await Tea.find({})
    console.log(teaList)
    response.json(teaList)
})

teaRouter.get('/:teaType', async(request, response) => {
    const teaType = request.params['teaType']
    logger.info(`Current tea type selected: ${teaType}`)
    response.json(`You've selected: ${teaType}`)
})

module.exports = teaRouter