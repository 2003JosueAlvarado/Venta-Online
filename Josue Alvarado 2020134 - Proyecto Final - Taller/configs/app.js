'use strict'



const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('../src/routes/user.routes');
const productRoutes=require('../src/routes/product.routes');
const categoryRoutes=require('../src/routes/category.routes');
const shoopingRoutes=require('../src/routes/carShooping.routes');
const billRoutes= require('../src/routes/Bill.routes');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/car', shoopingRoutes);
app.use('/bill',billRoutes)



module.exports = app;