"use strict";

const mongoose = require("mongoose");

// Module Four: trip collection schema from the SNHU Full Stack Guide.
// The date is stored as a MongoDB Date (UTC, ISO 8601 when serialized),
// and both trip code and trip name are indexed for efficient lookup.
const tripSchema = new mongoose.Schema({
  code: {
    type: String, required: true, trim: true, uppercase: true,
    index: true, unique: true, match: /^[A-Z0-9_-]+$/
  },
  name: { type: String, required: true, trim: true, index: true },
  length: { type: String, required: true, trim: true },
  start: { type: Date, required: true },
  resort: { type: String, required: true, trim: true },
  perPerson: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  // Retained from Module Three to support the existing HBS presentation.
  details: { type: String, trim: true }
}, { collection: "trips", versionKey: false });

const Trip = mongoose.models.trips || mongoose.model("trips", tripSchema, "trips");
module.exports = Trip;
