const { fetchTopics, fetchEndpoints } = require("../1_Models/test_model");
const { request, response } = require("../app");
const topics = require("../db/data/test-data/topics");

const getTopics = (request, response, next) => {
  fetchTopics().then((topics) => {
    // console.log("model is in controller");
    response.status(200).json({ topics });
  });
};

const getEndpoints = (request, response, next) => {
  fetchEndpoints().then((endpointsData) => {
    response.status(200).send(endpointsData);
  });
};

module.exports = { getTopics, getEndpoints };
