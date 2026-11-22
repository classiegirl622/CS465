"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Trip = require("../app_server/models/travlr");
const app = require("../app");

const trips = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/trips.json"), "utf8"));

test("Module Four schema maps to the MongoDB trips collection", () => {
  assert.equal(Trip.collection.collectionName, "trips");
  assert.equal(Trip.schema.path("start").instance, "Date");
  assert.ok(Trip.schema.path("code").options.index);
  assert.ok(Trip.schema.path("name").options.index);
  for (const field of ["code", "name", "length", "start", "resort", "perPerson", "image", "description"]) {
    assert.equal(Trip.schema.path(field).options.required, true, `${field} is not required`);
  }
});

test("Module Four trips.json records satisfy Mongoose validation", () => {
  assert.equal(trips.length, 3);
  assert.equal(new Set(trips.map(({ code }) => code)).size, 3);
  for (const trip of trips) {
    const record = new Trip(trip);
    assert.equal(record.validateSync(), undefined, `Invalid record ${trip.code}`);
    assert.ok(record.start instanceof Date);
  }
});

test("Module Four schema rejects absent required properties, malformed dates, and invalid codes", () => {
  const missing = { ...trips[0] };
  delete missing.name;
  assert.ok(new Trip(missing).validateSync()?.errors?.name);
  const badDate = new Trip({ ...trips[0], start: "not-a-date" });
  assert.ok(badDate.validateSync()?.errors?.start);
  const badCode = new Trip({ ...trips[0], code: "INVALID CODE!" });
  assert.ok(badCode.validateSync()?.errors?.code);
});

test("Module Four JSON API reports database unavailable instead of hanging when MongoDB is offline", async () => {
  const { mongoose } = require("../app_server/models/db");
  if (mongoose.connection.readyState === 1) return; // Local DB integration can be tested separately.
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/trips`);
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /MongoDB is not connected/);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
