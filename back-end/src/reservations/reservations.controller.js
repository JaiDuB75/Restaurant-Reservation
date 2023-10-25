/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservationis.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res){
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({data});
}

async function list(req, res) {
  
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  const data = await (date ? reservationsService.list(date) : reservationsService.search(mobile_number))
  
  res.json({data});
}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
};
