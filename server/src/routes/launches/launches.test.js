const request = require('supertest');
const { connectToMongoDB,desconnectFromMongoDB } = require('../../services/mongo');
const app = require('../../app');

describe('Test Launches API', () => {
    beforeAll(async () => {
        await connectToMongoDB();
    });

    afterAll(async () => {
        await desconnectFromMongoDB();
    });

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/api/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        
    });
})

describe('Test POST /launches', () => {

    test("It should respond with 201 created", async () => {
        const response = await request(app)
            .post('/api/v1/launches')
            .send({
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                launchDate: 'January 4, 2028',
                target: 'Kepler-442 b'
            })
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date('January 4, 2028');
        const responseDate = new Date(response.body.launchDate);

        expect(response.body).toMatchObject({
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b'
        });

        // Check if the response date matches the request date
        expect(responseDate).toEqual(requestDate);
    });

    test("It should catch missing required properties", async () => {
        const response = await request(app)
            .post('/api/v1/launches')
            .send({
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                launchDate: 'January 4, 2028'
            })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
        });
    });

    test("It should catch invalid dates", async () => {
        const response = await request(app)
            .post('/api/v1/launches')
            .send({
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                target: 'Kepler-62 f',
                launchDate: 'zoot'
            })
            .expect('Content-Type', /json/)
            .expect(400);
console.log(response.body);
        expect(response.body).toStrictEqual({
            error: 'Invalid launch date'
        });
    });

});
});