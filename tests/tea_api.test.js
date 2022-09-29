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
})