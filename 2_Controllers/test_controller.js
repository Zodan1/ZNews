const {
  fetchTopics,
  fetchEndpoints,
  fetchArticlesById,
  fetchAllArticles,
} = require("../1_Models/test_model");
const { request, response } = require("../app");
// const { request, response } = require("../app");
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
  fetchAllArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

module.exports = { getTopics, getEndpoints, getArticlesById, getAllArticles };
