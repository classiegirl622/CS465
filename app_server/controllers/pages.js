"use strict";

const { viewModel } = require("../models/site");

function renderPage(page) {
  return (_req, res) => res.render(page, viewModel(page));
}

function contactSubmitted(_req, res) {
  // Demonstration only. The Module Two assignment does not implement email delivery.
  res.render("contact", viewModel("contact", {
    formNotice: "This coursework demonstration does not send contact messages."
  }));
}

module.exports = { renderPage, contactSubmitted };
