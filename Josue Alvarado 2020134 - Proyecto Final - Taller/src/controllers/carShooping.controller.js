' use strict '

const {validateData,checkUpdate,findShoppingCart}=require('../utils/validate');
const shopCart =require('../models/carShooping.model');
const Product=require('../models/product.model');


exports.saveShoppingCar=async(req,res)=>{
    try{
        const params=req.body;
        const data = {
            product: params.product,
            quantity: params.quantity
        };
        const msg = validateData(data);

        if(!msg){

        const shop = new shopCart(data);
        await shop.save();
        return res.send({message: 'Product Save Successfully'});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}


exports.updateShoppingCar = async(req, res)=>{
    try{
        const params = req.body;
        const shoppingId = req.params.id;
        const check = await checkUpdate(params);
        if(check === false) return res.status(400).send({message: 'Data not received'});
        const updateShoppingCar = await ShoppingCar.findOneAndUpdate({_id: shoppingId}, params, {new: true});
        return res.send({message: 'Updated ShoppingCar', updateShoppingCar});
    }catch(err){
        console.log(err);
        return err;
    }
}


exports.deleteShopping = async (req, res) => {
    try {
        const shoppingId=req.params.id;
        const shoppingDeleted=await ShoppingCar.findOneAndDelete({_id: shoppingId});
        if(!shoppingDeleted) return res.status(500).send({message: 'ShoppingCar not found or already deleted'});
        return res.send({shoppingDeleted, message: 'Account deleted'});
    } catch (err) {
        console.log(err);
        return err;
    }
}


exports.addToShoppCart=async(req,res)=>{
    try{
        const params=req.body;
        const userId=req.user.sub;
        const data={
            product: params.product,
            quantity: params.quantity,
        };
        const msg=validateData(data);
        if(!msg){
            const findProduct=await Product.findOne({ _id: data.product })
            if(data.quantity>findProduct.stock){
                return res.send({ message: 'This quantity does not exist in our stock'});
            }else{
                const checkShoppCart= await findShoppingCart(userId);
                if(!checkShoppCart){
                    data.user=userId;
                    data.subtotal=(findProduct.price*data.quantity);
                    data.total=(data.subtotal);
                    const shoppCart=new shopCart(data);
                    await shoppCart.save();
                    console.log(shoppCart)
                    const shoppCartId=await shopCart.findOne({ user: userId })
                    const pushShoppCart=await shopCart.findOneAndUpdate({ _id: shoppCartId._id },
                        { $push: { products: data } }, { new: true })
                        .populate('product').lean();
                    return res.send({ message: 'added to shopping cart', pushShoppCart });
                }else{
                    const shoppCartId = shopCart.findOne({ user: userId });
                    const pushShoppCart = await shopCart.findOneAndUpdate({ _id: shoppCartId._id },
                        { $push: { products: data } }, { new: true })
                        .populate('product').lean();
                    return res.send({ message: 'added to shopping cart', pushShoppCart });
                }
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}