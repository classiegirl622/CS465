"use strict";

const mongoose = require("mongoose");
require("./travlr"); // Register the schema with Mongoose.

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbURI = process.env.MONGODB_URI || `mongodb://${dbHost}:27017/travlr`;
let connectionPromise;

mongoose.connection.on("connected", () => console.log("Mongoose connected to travlr database"));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));
mongoose.connection.on("error", (error) => console.error("Mongoose connection error:", error.message));

function connect() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  if (connectionPromise) return connectionPromise;
  connectionPromise = mongoose.connect(dbURI, { serverSelectionTimeoutMS: 5000 })
    .then(() => mongoose)
    .finally(() => { connectionPromise = null; });
  return connectionPromise;
}

async function disconnect() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

module.exports = { mongoose, dbURI, connect, disconnect };
