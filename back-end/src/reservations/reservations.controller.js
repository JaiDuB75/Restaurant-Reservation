/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "reservation_time",
  "people"
);

async function create(req, res){
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({data});
}

async function list(req, res) {
  
  const {date, currentDate} = req.query;
  if(date){
    const reservations = await reservationsService.listReservationsForDate(date);
    res.json({data: reservations});
  }else if (currentDate){
    const reservations = await reservationsService.listReservationForDate(currentDate);
    res.json({data: reservations});
  }else{
    const reservations = await reservationsService.list();
    res.json({data: reservations});
  }

}

async function listAllReservations(req, res,next){
  const reservations = await reservationsService.list();
  res.json({data: reservations});
}

async function listTable(req, res, next){
  const data = res.locals.reservation;
  res.status(200).json({data});
}

async function create(req, res){
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({data});
}


async function createTable(req, res,next){
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({data});
}

function read(req,res,next){
  const data = res.locals.reservation;
  res.status(200).json({data})
}

async function updatedReservationStatus(req, res,next){
  const {status} = req.body.data;
  const reservation = res.locals.reservation;
  const data = await reservationsService.updatedReservationStatus(
    reservation.reservation_id,
    status
  );
}

async function reservationExists(req, res, next){
  const {reservation_id} = req.params;
  const reservation = await reservationsService.read(reservation_id);
  if(reservation){
    res.locals.reservation = reservation;
    return next(); 
  }
}

function notFinishedForUpdate(req, res, next){
  const reservation = res.locals.reservation;
  if (reservation.status === "finished") {
    next({
      status: 400,
      message: "reservation cannot already be finished.",
    });
  } else {
    return next();
  }
}

function updatedValidationStatus(req,res,next){
  const status = req.body.data.status;
  if (status !== "unknown") {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be unknown.",
  });
}



module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
};
