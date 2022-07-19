'use strict'

const mongoose=require('mongoose');

const carSchema=mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
    quantity : Number,
    total: Number,
});

module.exports=mongoose.model('ShoppingCar', carSchema);