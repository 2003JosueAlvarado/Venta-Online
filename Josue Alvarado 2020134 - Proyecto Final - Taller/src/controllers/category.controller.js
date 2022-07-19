'use strict '

const { findOneAndUpdate } = require('../models/category.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const {validateData,checkUpdate,searchCategoryId}= require('../utils/validate');

exports.saveCategory = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
        };
        const msg = validateData(data);
        if(!msg){
        
        const category = new Category(data);
        await category.save();
        return res.send({message: 'Category Save Successfully'});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.send({ categories });
    } catch (err) {
        console.log(err);
        return err;
    }
}


exports.updateCategory = async(req, res)=>{
    try{
        const params = req.body;
        const categoryId = req.params.id;
        const check = await checkUpdate(params);
        if(check === false) return res.status(400).send({message: 'Data not received'});
        const updateCategory = await Category.findOneAndUpdate({_id: categoryId}, params, {new: true});
        return res.send({message: 'Updated Category', updateCategory});
    }catch(err){
        console.log(err);
        return err;
    }
}


exports.deleteCategory=async(req,res)=>{
    try{
        const cateId=req.params.id;
        const cateExist=await searchCategoryId(cateId);
        if(!cateExist)
        return res.status(500).send({message: 'Category not found or already delete'});
        if(cateExist.name === 'DEFAULT')
        return res.send({message: 'Default category cannot be deleted.'});
        const newCate = await Category.findOne({name:'DEFAULT'}).lean();
        const products = await Product.find({category:cateId});
        for(let arreglo of products){
            const updateNewCategory = await Product.findOneAndUpdate({_id:arreglo._id},{category:newCate._id});
        }
        const categDeleted = await Category.findOneAndDelete({_id: cateId});
        return res.send({message: 'Delete Category.', categDeleted});
    }
    catch(err){
        console.log(err);
        return err;
    }
}