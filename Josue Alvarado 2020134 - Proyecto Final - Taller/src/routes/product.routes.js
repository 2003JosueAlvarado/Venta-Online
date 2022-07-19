'use strict'

const producController=require('../controllers/product.controller');
const express=require('express');
const api=express.Router();
const mdAuth=require('../services/authenticated');

api.post('/saveProduct',[mdAuth.ensureAuth,mdAuth.isAdmin], producController.saveProduct);
api.get('/getProducts', producController.getProducts);
api.get('/getProduct/:id', producController.getProduct);
api.post('/searchProduct', producController.searchProduct);
api.put('/updateProduct/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],producController.updateProduct);
api.delete('/deleteProduct/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],producController.deleteProduct);
api.get('/productsTired',[mdAuth.ensureAuth,mdAuth.isAdmin],producController.productsTired);
api.get('/productsSold',[mdAuth.ensureAuth,mdAuth.isAdmin], producController.productsSold);

module.exports = api;