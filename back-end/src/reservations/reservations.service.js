const knex = require("../db/connection");

function list(){
    return knex("reservations").select("*").where({reservation_date}).whereNot({status: "finished"}).orderBy("reservation_time");
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

function create(reservation){
    return knex("reservations").insert(reservation).returning("*").then((createdReservation) => createdReservation[0]);
}

function createTable(newTable){
  return knex("table").insert(newTable).select("*").then((createdTable) => createdTable[0]);
}

function read(reservation_id){
  return knex("reservation").select("*").where({reservation_id}).then((selectedReservation) => selectedReservation[0]);
}

function listReservationForDate(date){
  return knex("reservation").select("*").where({reservation_date: date}).whereNot({status: "finished"}).orderBy("reservation_time");
}

function listTables(){
  return knex("tables").select("*").orderBy("table_name");
}

function updateReservationStatus(reservation_id, newStatus){
  return knex("reservations").where({reservation_id}).update({status: newStatus}, "*");
}

module.exports = {
    list,
    listTables,
    listReservationForDate,
    search,
    create,
    createTable,
    read,
    updateReservationStatus,
};