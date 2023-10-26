const knex = require("../db/connection");

function create(newTable){
    return knex("tables").insert(newTable).returning("*").then((createdTables) => createdTables[0]);
}

function readTables(table_id){
    return knex("tables").select("*").where({table_id}).first();
}

function readResrvation(reservation_id){
    return knex("reservations").select("*").where({reservation_id}).first();
}

function updatedSeatReservation(reservation_id, table_id){
    return knex("reservations").where({reservation_id}).update({status: "seated"}).then(() => {
        return knex("tables").where({table_id}).update({reservation_id: reservation_id, table_status: "occupied"}).returning("*"); 
    })
}

function destoryTable(table_id, reservation_id){
    return knex("tables").where({table_id}).update(
        {
            reservation_id: null,
            table_status: "free",
        }, "*"
    ).then(() => {
        return knex("reservations").where({reservation_id}).update({status: "finished"}, "*");
    })
}

function list(){
    return knex("tables").select("*").orderBy("table_name");
}

module.exports = {
    create,
    readResrvation,
    readTables,
    updatedSeatReservation,
    destoryTable,
    list,
}