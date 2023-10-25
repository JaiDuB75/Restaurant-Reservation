const tables = require("./01-tables.json"); //imports the information from taables.json
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex
    .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")//Resests the database
    .then(() => knex("tables").insert(tables));// Inserts the new information from the tables.json to the database
};
