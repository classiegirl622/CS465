"use strict";

const express = require("express");
const router = express.Router();
const travelController = require("../controllers/travel");

// MVC route: GET /travel -> controller -> JSON -> travel.hbs
router.get("/", travelController.travel);

module.exports = router;
