const db = require("../db/connection");
const fs = require("fs");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchEndpoints = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("endpoints.json", "utf8", (err, endpointsData) => {
      if (err) reject(err);

      resolve(JSON.parse(endpointsData));
    });
  });
};

const fetchArticlesById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return result.rows[0];
    });
};

const fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

const fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return result.rows;
    });
};

const addComments = (article_id, username, body) => {
  return db
    .query(
      `
    SELECT * FROM articles WHERE article_id = $1;
  `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return db.query(
        `
      INSERT INTO comments (article_id, author, body, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING comment_id, votes, created_at, author, body, article_id;
    `,
        [article_id, username, body]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};

const updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 
    RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return result.rows[0];
    });
};

module.exports = {
  fetchTopics,
  fetchEndpoints,
  fetchArticlesById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  addComments,
  updateArticleVotes,
};
