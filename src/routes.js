const { Router } = require('express');
const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ message: "I'm ok" });
});

module.exports = routes;
