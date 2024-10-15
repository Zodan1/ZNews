const { getTopics, getEndpoints } = require("./2_Controllers/test_controller");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Path Not Found" });
});

module.exports = app;
