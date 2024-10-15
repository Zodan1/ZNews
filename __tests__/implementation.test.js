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
  describe("GET /api/articles/:article_id ", () => {
    it("should respond with status 200 and the article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const expectedProperties = [
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "article_img_url",
          ];

          expectedProperties.forEach((property) => {
            expect(response.body.article).toHaveProperty(property);
          });
        });
    });

    it("should respond with status 404 if the article is not found", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article Not Found");
        });
    });
    it("should respond with status 400 if the article ID is invalid", () => {
      return request(app)
        .get("/api/articles/invalidId")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid input");
        });
    });
  });
  describe("GET /api/articles", () => {
    it("should respond with status 200 and an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeInstanceOf(Array);
          response.body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    it("should respond with a status 200 and array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const expectedProperties = [
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body",
            "article_id",
          ];

          response.body.comments.forEach((comment) => {
            expectedProperties.forEach((property) => {
              expect(comment).toHaveProperty(property);
            });
          });
        });
    });
    it("should respond with status 404 if the article is not found", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article Not Found");
        });
    });
    it("should respond with status 400 if the article_id is invalid", () => {
      return request(app)
        .get("/api/articles/invalidId/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid input");
        });
    });
  });
});
