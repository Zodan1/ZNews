const {
  fetchTopics,
  fetchEndpoints,
  fetchArticlesById,
  fetchAllArticles,
  fetchCommentsByArticleId,
} = require("../1_Models/test_model");
const { request, response } = require("../app");
const articles = require("../db/data/test-data/articles");
const topics = require("../db/data/test-data/topics");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      // console.log("model is in controller");
      response.status(200).json({ topics });
    })
    .catch(next);
};

const getEndpoints = (request, response, next) => {
  fetchEndpoints().then((endpointsData) => {
    response.status(200).send(endpointsData);
  });
};

const getArticlesById = (request, response, next) => {
  const { articles_id } = request.params;
  fetchArticlesById(articles_id)
    // console
    //   .log(articles_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

const getAllArticles = (request, response, next) => {
  fetchAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id)
    // console
    //   .log(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getEndpoints,
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
};
