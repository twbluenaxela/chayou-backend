const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')

const api = supertest(app)

describe('see if the web crawler can search', () => {
    test('to see if webcrawler can bring back results for tieguanyin', async () => {
        const resultTeas = await api
        .get('/api/tea/tieguanyin')
        console.log('Result teas:  ', resultTeas.body);
        const teaNames = resultTeas.body.map((t) => expect(t.name).toBeDefined())
        //the timeout is long because each search instance takes about 4-7 seconds. the api currently as of 9/29/22 searches two websites. so it should take a while. 
    }, 13000)
    test('if after sending wrong search results, it will send the default tea for Tea and Whisk', async () => {
        //So I would make a test that would check if it sends a 401 request if no results are found. However
        // the issue is that Tea and Whisk will send a default tea if no related teas were found. So the results array where I combine the results from 
        //yunnan sourcing and tea and whisk will never be empty (at least until they change their site). 
        //So in this case, 'empty' would just be getting the default tea from Tea and Whisk.
        const results = await api
        .get('/api/tea/mario')
        console.log('Results: ', results)
        expect(results.body.length).toBe(1)
    }, 20000)
})