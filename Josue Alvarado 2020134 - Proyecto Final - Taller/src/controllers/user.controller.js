'use strict'

const res = require('express/lib/response');
const User = require('../models/user.model');
const {validateData, searchUser, encrypt, checkPassword, checkPermission, checkUpdate} = require('../utils/validate');
const jwt = require('../services/jwt');
const { param } = require('../routes/user.routes');



exports.register = async (req, res)=>{
    try{
        let params = req.body;
        let data = { 
            name: params.name,
            username: params.username,
            password: params.password,
            role: 'CLIENT'
        };
        const msg = validateData(data);
        if(!msg){
            let userExist = await searchUser(params.username);
            if(!userExist){
                data.surname = params.surname;
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encrypt(params.password);

                let user = new User(data);
                await user.save();
                return res.send({message: 'User created succesfully'});
            }else{
                return res.send({message: 'Username already in use, choose another username'});
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
  
}
exports.login = async (req, res)=>{
    try{
        const params = req.body;
        const   data = { 
            username: params.username,
            password: params.password
        }
        let msg = validateData(data);

        if(!msg){
            let userExist = await searchUser(params.username);
            if(userExist && await checkPassword(params.password, userExist.password)){
                const token = await jwt.createToken(userExist);
                return res.send({token,message: 'Login Successfully'});
            }else{
                return res.send({message: 'Username or Password incorrect'});
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.update = async (req, res)=>{
    
    try{
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'Unauthorized to update this user'});
        else{
            const notUpdated = await checkUpdate(params);
            if(notUpdated === false) return res.status(400).send({message: 'This param can only update by admin'});
                const already = await searchUser(params.username);
                if(!already){
                    const userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new:true}).lean()
                    return res.send({userUpdated, message: 'User updated'});
                }else{
                     return res.send({message: 'Username already taken'})
                }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.delete = async(req, res)=>{
    try{
        
        const userId = req.params.id;
            const permission = await checkPermission(userId, req.user.sub);
            if(permission === false) return res.status(401).send({message: 'Unauthorized to delete this user'});
            const userDeleted = await User.findOneAndDelete({_id: userId});
            if(!userDeleted) return res.status(500).send({message: 'User not found or already deleted'});
            return res.send({userDeleted, message: 'Account deleted'});
    }catch(err){
        console.log(err);
        return err;
    }
}