"use strict";

const Trip = require("../models/travlr");
const { mongoose } = require("../models/db");

function databaseReady(res) {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({ error: "MongoDB is not connected. Start MongoDB and restart Travlr." });
  return false;
}

async function tripsList(_req, res) {
  if (!databaseReady(res)) return;
  try {
    const trips = await Trip.find({}).sort({ name: 1 }).select("-__v").lean();
    return res.status(200).json(trips);
  } catch (error) {
    console.error("Unable to fetch trips:", error);
    return res.status(500).json({ error: "Unable to retrieve trips" });
  }
}

async function tripsFindByCode(req, res) {
  if (!databaseReady(res)) return;
  try {
    const code = String(req.params.code || "").trim().toUpperCase();
    const trip = await Trip.findOne({ code }).select("-__v").lean();
    return trip ? res.status(200).json(trip) : res.status(404).json({ error: "Trip not found" });
  } catch (error) {
    console.error("Unable to fetch trip:", error);
    return res.status(500).json({ error: "Unable to retrieve trip" });
  }
}

module.exports = { tripsList, tripsFindByCode };
