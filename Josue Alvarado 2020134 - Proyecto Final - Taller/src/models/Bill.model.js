'use strict'

const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    date: { type: Date, default: Date.now() } ,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
    total: Number
});

module.exports = mongoose.model('Invoice',billSchema);