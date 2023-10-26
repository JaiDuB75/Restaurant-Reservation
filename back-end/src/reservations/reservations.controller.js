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

function validatePeopleNumber(req, res,next){
  const people = req.body.data.people;

  if(people > 0 && typeof people === "number"){
    return next();
  }

  next({
    status: 400,
    message: "Valid people property required.",
  })
}

function validateDate(req, res, next){
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);

  if(valid){
    return next();
  }

  next({
    status: 400,
    message: "reservation_date must be valid date.",
  })
}

function validateTime(req, res, next){
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  const time = req.body.data.reservation_time;
  const valid = time.match(regrex);
  if(valid){
    return next();
  }
  next({
    status: 400,
    message: 'reservation_time must be valid time.',
  })
}

function notTuesday(req, res, next){
  const date = req.body.data.reservation_date;
  const weekday = new Date(date).getUTCDay();
  if(weekday === 2){
    return next({
      status: 400,
      message: "Resaurant is closed on Tuesdays."
    })
  }
}

function validateReservationPast(req, res, next){
  const { reservation_date, reservation_time } = req.body.data;
  const today = Date.now();
  const proposedDate = new Date(
    `${reservation_date} ${reservation_time}`
  ).valueOf();
  if (proposedDate > today) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be in the future.",
  });
}

function validateRestaurantHours(req, res, next){
  let openingTime = "10:30";
  let closingTime = "21:30";

  let {reservation_time} = req.body.data;

  if(reservation_time < openingTime || reservation_time > closingTime){
    return next({
      status: 400,
      message: "Reservations must be made during Restuarant Hours: 10:30 AM and 9:30 PM.",
    })
  }

  next();

}

function validateSeating(req, res, next){
  const status = req.body.data.status;
  if(status !== "seated"){
    return next();
  }

  next({
    status: 400,
    message: "Table is not available"
  })
}

function validFinished(req, res, next){
  const status = req.body.data.status;
  if(status !== "finished"){
    return next();
  }

  next({
    status: 400,
    message: "Table must not be finished"
  })

}

module.exports = {
  create: [hasProperties, validateDate, validateTime, validatePeopleNumber,
    validateReservationPast, notTuesday, validateRestaurantHours, 
    validateSeating, validFinished,asyncErrorBoundary(create)],
  createTable: asyncErrorBoundary(createTable),
  read: [asyncErrorBoundary(reservationExists), read],
  updatedReservationStatus: [asyncErrorBoundary(reservationExists), notFinishedForUpdate,
    updatedValidationStatus, asyncErrorBoundary(updatedReservationStatus)],
  list: asyncErrorBoundary(list),
  listAllReservations,
  listTable: asyncErrorBoundary(listTable)
};
