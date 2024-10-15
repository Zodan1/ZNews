const data = require("../db/data/test-data/index");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("app", () => {
  it("GET 404 if Endpoint does not exist", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path Not Found");
      });
  });
  describe("/api/topics", () => {
    it("GET 200 sends an array to the client", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
  describe("GET /api", () => {
    it("should respond with status 200 and the API documentation", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          // console.log(response);
          const expectedProperties = [
            "GET /api",
            "GET /api/topics",
            "GET /api/articles",
          ];
          expectedProperties.forEach((property) => {
            expect(response.body).toHaveProperty(property);
          });
        });
    });
  });
});
