const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => {
      
      const newRec = {
        first_name: createdRecords[0].first_name, 
        last_name: createdRecords[0].last_name,
        mobile_number: createdRecords[0].mobile_number,
        people: parseInt(createdRecords[0].people)
      }
      console.log("Created Records", newRec)
      return newRec;
    });
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .then((result) => result[0]);
}

function list() {
  return knex("reservations")
    .select("*")
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function listReservationsForDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function createTable(table) {
  return knex("tables")
    .insert(table)
    .select("*")
    .then((createdRecords) => createdRecords[0]);
}

function updateResStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: status }, "*");
}

function listTables() {
  return knex("tables").select("*").orderBy("table_name");
}

function listByPhone(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  create,
  read,
  updateResStatus,
  list,
  listReservationsForDate,
  createTable,
  listTables,
  listByPhone, 
};