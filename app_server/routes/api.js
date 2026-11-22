"use strict";

const express = require("express");
const router = express.Router();
const tripsApi = require("../controllers/tripsApi");

// Module Four JSON read-only preview; expanded REST API is Module Five.
router.get("/trips", tripsApi.tripsList);
router.get("/trips/:code", tripsApi.tripsFindByCode);
module.exports = router;
