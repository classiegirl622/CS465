"use strict";

const express = require("express");
const router = express.Router();
const travelerController = require("../controllers/traveler");

router.get("/", travelerController.travel);

module.exports = router;
