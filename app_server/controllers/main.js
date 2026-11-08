"use strict";

const { viewModel } = require("../models/site");

function index(_req, res) {
  res.render("index", viewModel("index"));
}

module.exports = { index };
