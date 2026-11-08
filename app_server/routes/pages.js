"use strict";

const express = require("express");
const router = express.Router();
const { pages } = require("../models/site");
const pagesController = require("../controllers/pages");

for (const page of pages) {
  if (page.key !== "index" && page.key !== "travel") {
    router.get(page.href, pagesController.renderPage(page.key));
  }
  // Existing .html bookmarks redirect to new MVC URLs, rather than bypass HBS.
  router.get(`/${page.key}.html`, (_req, res) => res.redirect(301, page.href));
}

router.post("/contact", pagesController.contactSubmitted);

module.exports = router;
