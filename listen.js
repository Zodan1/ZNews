const app = require("./app");

const PORT = 8080;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${PORT}...`);
});
