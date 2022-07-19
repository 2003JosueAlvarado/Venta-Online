'use strict'

const express=require('express');
const carContoller=require('../controllers/carShooping.controller');
const api=express.Router();
const mdAuth=require('../services/authenticated');



api.post('/addCar',mdAuth.ensureAuth, carContoller.addToShoppCart);
api.post('/saveShopping', mdAuth.ensureAuth,carContoller.saveShoppingCar);
api.put('/updateShopping/', carContoller.updateShoppingCar);
api.delete('/deleteShopping/', carContoller.deleteShopping);




module.exports = api;