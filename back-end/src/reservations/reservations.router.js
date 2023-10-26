/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").post(controller.create).get([controller.list, controller.listTable]).all(methodNotAllowed);

router.route("/:reservation_id/seat").post(controller.createTable).all(methodNotAllowed);

router.route("/:reservation_id/status").put(controller.updatedReservationStatus).all(methodNotAllowed);

router.route("/:reservation_id").get(controller.read).all(methodNotAllowed);

module.exports = router;
