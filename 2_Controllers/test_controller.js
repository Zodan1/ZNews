const { fetchTopics } = require("../1_Models/test_model");
const topics = require("../db/data/test-data/topics");

const getTopics = (request, response, next) => {
  fetchTopics().then((topics) => {
    console.log("model is in controller");
    response.status(200).json({ topics });
  });
};

module.exports = { getTopics };
