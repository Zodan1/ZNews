const {
  getTopics,
  getEndpoints,
  getArticlesById,
  getCommentsByArticleId,
  postComments,
  patchArticleVotes,
  deleteCommentsById,
  getUsers,
  getArticles,
} = require("./2_Controllers/test_controller");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api/articles", getArticles);

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:articles_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentsById);

app.get("/api/users", getUsers);

//error handling

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Path Not Found" });
});

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, request, response, next) => {
  // console.log(err);
  response.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
