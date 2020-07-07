const express = require("express");
const routes = express.Router();
const instructors = require('./instructors')

routes.get("/", (request, response) => {
  return response.redirect("/instructors");
});

routes.get("/instructors", instructors.index);

routes.get("/instructors/create", (request, response) => {
  return response.render("instructors/create");
});

routes.post("/instructors", instructors.post);

routes.put("/instructors", instructors.put);

routes.delete("/instructors", instructors.delete);

routes.get("/instructors/:id", instructors.show);

routes.get("/instructors/:id/edit", instructors.edit);

routes.get("/members", (request, response) => {
  return response.render("members");
});

module.exports = routes;