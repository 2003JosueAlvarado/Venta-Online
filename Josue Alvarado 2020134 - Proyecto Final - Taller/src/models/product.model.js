'use strict'

const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const productSchema=mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    sales: Number,
    stock: Number,
    category: {type: mongoose.Schema.ObjectId, ref: 'Category'}

});

module.exports=mongoose.model('Product', productSchema);