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

const removeCommentsById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments 
    WHERE comment_id = $1
    RETURNING *;`,
      [comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
    });
};

const fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

const fetchArticles = (sort_by = "created_at", order = "desc") => {
  const validSortColumns = [
    "title",
    "author",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrderOptions = ["asc", "desc"];

  if (
    !validSortColumns.includes(sort_by) ||
    !validOrderOptions.includes(order)
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db
    .query(
      `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `
    )
    .then((result) => {
      return result.rows;
    });
};

module.exports = {
  fetchTopics,
  fetchEndpoints,
  fetchArticlesById,
  fetchCommentsByArticleId,
  addComments,
  updateArticleVotes,
  removeCommentsById,
  fetchUsers,
  fetchArticles,
};
