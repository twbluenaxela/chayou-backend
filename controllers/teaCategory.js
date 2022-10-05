const teaCategoryRouter = require('express').Router()
const { response } = require('express')
const TeaCategory = require('../models/teaCategory')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

teaCategoryRouter.get('/', async (req, res) => {
    logger.info('Grabbing tea categories...')
    const teaCategoryList = await TeaCategory.find({})
    logger.info(`Tea category list: ${teaCategoryList}`)
    res.json(teaCategoryList)

})

teaCategoryRouter.get('/:type', async (req, res) => {
    const teaCategoryToSearchFor = req.params['type']
    logger.info(`Server received: ${teaCategoryToSearchFor}`)
    const matchedTeaCategories = await TeaCategory.find({ type: teaCategoryToSearchFor })

    if(matchedTeaCategories){
        res.json(matchedTeaCategories)
    }else{
        res.status(404).end()
    }
})

teaCategoryRouter.post('/', async (req, res) => {
    const receivedTeaCategory = req.body
    console.log('Received: ', receivedTeaCategory)

    const category = new TeaCategory({
        englishName: receivedTeaCategory.englishName,
        chineseName: receivedTeaCategory.chineseName,
        type: receivedTeaCategory.type
    })

    if(category.englishName && category.chineseName && category.type){
        const savedTeaCategory = await category.save()
        res.status(201).json(savedTeaCategory)

    }else{
        res.sendStatus(400)
    }
})



module.exports = teaCategoryRouter;