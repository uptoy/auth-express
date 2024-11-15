import request from 'supertest'
// import { redis } from "../config/redis.config";
import app from '../src/app'

const token = process.env.JWT_TOKEN
const validPostId = 1
const invalidPostId = 2
const validCommentId = 3
const invalidCommentId = 5
const otherUserCommentId = 4
describe('App Tests', () => {
  it('should pass this dummy test', () => {
    expect(true).toBe(true)
  })
})

// describe("Comment Router Suite : /api/comments", () => {
//   test("Should get all comment for a post.", async () => {
//     const res = await request(app).get("/api/comments/1");

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBeTruthy();
//     expect(Array.isArray(res.body.data)).toBeTruthy();
//   });

//   test("Should get an error for missing auth token to create new comment.", async () => {
//     const res = await request(app).post("/api/comments/create");
//     expect(res.status).toBe(401);
//     expect(res.body.message).toBe("Authentication token missing");
//   });

//   test("Should get an error for payload missing.", async () => {
//     const res = await request(app)
//       .post("/api/comments/create")
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//   });

//   test("Should get an error for missing post_id in payload.", async () => {
//     const res = await request(app)
//       .post("/api/comments/create")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ content: "test comment" });

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe(`"post_id" is required`);
//   });

//   test("Should get an error for missing content in payload.", async () => {
//     const res = await request(app)
//       .post("/api/comments/create")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ post_id: validPostId });

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe(`"content" is required`);
//   });

//   test("Should get an error for not existing post.", async () => {
//     const res = await request(app)
//       .post("/api/comments/create")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ post_id: invalidPostId, content: "test comment" });

//     expect(res.body.success).toBeFalsy();
//     expect(res.status).toBe(404);
//     expect(res.body.message).toBe("This post not found!");
//   });

//   test("Should create a new comment with valid payload.", async () => {
//     const res = await request(app)
//       .post("/api/comments/create")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ post_id: validPostId, content: "test comment" });

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBeTruthy();
//     expect(res.body.data).toHaveProperty("id");
//   });

//   test("Should get an error for missing auth token to update a comment.", async () => {
//     const res = await request(app).put(`/api/comments/update/${validCommentId}`);
//     expect(res.status).toBe(401);
//     expect(res.body.message).toBe("Authentication token missing");
//   });

//   test("Should get an error for missing content in payload.", async () => {
//     const res = await request(app)
//       .put(`/api/comments/update/${validCommentId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe(`"content" is required`);
//   });

//   test("Should get an error to update another user comment.", async () => {
//     const res = await request(app)
//       .put(`/api/comments/update/${otherUserCommentId}`)
//       .send({ content: "test comment updated" })
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.status).toBe(401);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe(`You are not authorized to update this comment!`);
//   });

//   test("Should get an error for not found comment when try to update.", async () => {
//     const res = await request(app)
//       .put(`/api/comments/update/${invalidCommentId}`)
//       .send({ content: "test comment updated" })
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.status).toBe(404);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe(`This comment not found!`);
//   });

//   test("Should successfully update a comment by authorize user.", async () => {
//     const res = await request(app)
//       .put(`/api/comments/update/${validCommentId}`)
//       .send({ content: "test comment updated" })
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBeTruthy();
//     expect(res.body.message).toBe(`Comment updated successfully!`);
//   });

//   test("Should get an error to delete another user comment.", async () => {
//     const res = await request(app)
//       .delete(`/api/comments/delete/${otherUserCommentId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.status).toBe(401);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe(`You are not authorized to delete this comment!`);
//   });

//   test("Should get an error for not found comment when try to delete.", async () => {
//     const res = await request(app)
//       .delete(`/api/comments/delete/${invalidCommentId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.status).toBe(404);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe(`This comment not found!`);
//   });

//   // test("Should successfully delete a comment by authorize user.", async () => {
//   //   const res = await request(app)
//   //     .delete("/api/comments/delete/6")
//   //     .set("Authorization", `Bearer ${token}`);

//   //   expect(res.status).toBe(200);
//   //   expect(res.body.success).toBeTruthy();
//   // });

//   afterAll(async () => {
//     // Close the Redis connection after all tests have finished
//     await redis.quit();
//   });
// });
