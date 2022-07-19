'use strict'

const userController = require('../controllers/user.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id', mdAuth.ensureAuth, userController.update);
api.delete('/delete/:id', mdAuth.ensureAuth, userController.delete);

module.exports = api;