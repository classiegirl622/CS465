"use strict";

const { viewModel } = require("../models/site");

function travel(_req, res) {
  res.render("travel", viewModel("travel"));
}

module.exports = { travel };
