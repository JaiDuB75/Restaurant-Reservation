const reservations = require("./00-reservations.json"); //imports the data from reservations.json
exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE") //drops the previous columns
  .then(() => knex("reservations").insert(reservations)); //inserts the information from reservations.json to the reservations table 
};
