// backend/server.js
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`NovaMind-AI backend listening on port ${PORT} 🚀`);
});
