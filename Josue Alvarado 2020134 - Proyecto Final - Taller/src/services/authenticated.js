'use strict'

const jwt = require('jwt-simple');
const secretKey = 'CualquierDato';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'The request does not contain the authentication header'});
    }else{
        try{
            let token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, secretKey);
        }catch(err){
            console.log(err);
            return res.status(403).send({message: 'Token is not valid or expired'});
        }
        req.user = payload;
        next();
    }
}

exports.isAdmin = (req, res, next)=>{
    try{
        const role = req.user.role;
        if(role === 'ADMIN') return next();
        else return res.status(401).send({message: 'Unautorized to this function'})
    }catch(err){
        console.log(err);
        return err;
    }
}