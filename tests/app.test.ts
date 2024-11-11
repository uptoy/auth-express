import request from 'supertest'
// import { redis } from "../config/redis.config";
import app from '../src/app'

// describe("App Tests", () => {
//   it("should pass this dummy test", () => {
//     expect(true).toBe(true);
//   });
// });

describe('Test Home Route :/', function () {
  test('Home route should return a text with status code 200', async function () {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toEqual('{"message":"Welcome to our Blog!"}')
  })

  // afterAll(async () => {
  //   // Close the Redis connection after all tests have finished
  //   await redis.quit();
  // });
})
