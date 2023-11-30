const request = require('supertest');
const app = require('../app');
const { json } = require('express');
const { mongoConnect, mongoDisconnect } = require('../services/mongo')

describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 sucess', async () => {

            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            //const response = await request(app).get('/launches');
            //expect(response.statusCode).toBe(200);
        });
    });

    describe('Test POST /launch', () => {
        const completeLaunchData = {
            mission: "ZTM155",
            rocket: "ZTM Experimentol IS1",
            target: "Kepler-62 f",
            launchDate: "January 17, 2030",
        };

        const launchDataWithoutDate = {
            mission: "ZTM155",
            rocket: "ZTM Experimentol IS1",
            target: "Kepler-62 f"
        };

        const launchDataInvalidDate = {
            mission: "ZTM155",
            rocket: "ZTM Experimentol IS1",
            target: "Kepler-62 f",
            launchDate: "hellooo123",
        };

        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);

            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
        });

        test('It should catch invalid dates', async () => {

            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid Launch Date',
            });
        });
    });

    afterAll(async () => {
        await mongoDisconnect();
    });
})

