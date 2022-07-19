'use strict'

const billController = require('../controllers/bill.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/checkbill/:id',mdAuth.ensureAuth,billController.checkBill);

module.exports = api;