const {
  getTopics,
  getEndpoints,
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
} = require("./2_Controllers/test_controller");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:articles_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Path Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
