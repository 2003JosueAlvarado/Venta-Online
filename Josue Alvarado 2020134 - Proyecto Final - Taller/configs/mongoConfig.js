'use strict'

const mongoose = require('mongoose');

exports.init = ()=>{
    const uriMongo = 'mongodb://127.0.0.1:27017/proyectofinal';
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', ()=>{
        console.log('MongoDB | could not connect to mongodb');
        mongoose.disconnect();
    });
    mongoose.connection.on('connecting', ()=>{
        console.log('MongoDB | try connecting');
    });
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB | connected to mongodb');
    });
    mongoose.connection.on('open', ()=>{
        console.log('MongoDB | connected to database');
    });
    mongoose.connection.on('reconnnected', ()=>{
        console.log('MongoDB | reconnected to mongodb');
    });
    mongoose.connection.on('disconnected', ()=>{
        console.log('MongoDB | disconnected to mongodb');
    });

    mongoose.connect(uriMongo, {
        maxPoolSize: 50,
        connectTimeoutMS: 2500,
        useNewUrlParser: true
    }).catch(err=>console.log(err));
}