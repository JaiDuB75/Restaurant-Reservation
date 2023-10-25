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

module.exports = {
    list,
    search,
    create,
};