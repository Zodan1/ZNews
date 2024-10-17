const {
  fetchTopics,
  fetchEndpoints,
  fetchArticlesById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  addComments,
  updateArticleVotes,
  removeCommentsById,
} = require("../1_Models/test_model");
const { request, response } = require("../app");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch(next);
};

const getEndpoints = (request, response, next) => {
  fetchEndpoints().then((endpointsData) => {
    response.status(200).send({ endpointsData });
  });
};

const getArticlesById = (request, response, next) => {
  const { articles_id } = request.params;
  fetchArticlesById(articles_id)
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
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

const postComments = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  if (!username || !body) {
    return response.status(400).send({ msg: "Bad Request" });
  }
  addComments(article_id, username, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

const patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  if (typeof inc_votes !== "number") {
    return response.status(400).send({ msg: "Bad Request" });
  }
  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      response.status(200).send({ updatedArticle });
    })
    .catch(next);
};

const deleteCommentsById = (request, response, next) => {
  const { comment_id } = request.params;

  removeCommentsById(comment_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getEndpoints,
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
  postComments,
  patchArticleVotes,
  deleteCommentsById,
};
