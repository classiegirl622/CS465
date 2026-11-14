"use strict";

// Module Three: retrieve the trip collection from JSON and pass it to HBS.
// The data file is resolved from the project root, not the terminal's cwd.
const fs = require("node:fs");
const path = require("node:path");
const { viewModel } = require("../models/site");

const tripsPath = path.join(__dirname, "..", "..", "data", "trips.json");

function travel(_req, res, next) {
  try {
    // Read on each request for coursework prototyping: editing trips.json and
    // refreshing /travel changes the page without restarting the server.
    const trips = JSON.parse(fs.readFileSync(tripsPath, "utf8"));
    if (!Array.isArray(trips)) {
      throw new TypeError("trips.json must contain an array of trips");
    }
    res.render("travel", viewModel("travel", { trips }));
  } catch (error) {
    next(error);
  }
}

module.exports = { travel };
