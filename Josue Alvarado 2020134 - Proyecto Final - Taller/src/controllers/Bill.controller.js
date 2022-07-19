' use strict '

const { validateData, checkUpdate, findShoppingCart } = require('../utils/validate');
const Bill = require('../models/Bill.model');
const shopCart = require('../models/carShooping.model');
const Product = require('../models/product.model');

exports.checkBill = async (req, res) => {
    try {
        const userId = req.user.sub;
        const findShoppingCart = await shopCart.findOne({ user: userId }).populate('product').lean();
        if (findShoppingCart === null) {
            return res.send({ message: 'There are no products in the cart' })
        } else {
            for (let index = 0; index < findShoppingCart.product.length; index++) {
                const shoppingCartProduct = await findShoppingCart.product[index];


                const indexProduct = await findShoppingCart.product[index].product.valueOf();
                const productId = await Product.findOne({ _id: indexProduct }).lean();

                let quantity = shoppingCartProduct.quantity;
                const data = { 
                    stock: productId.stock, 
                    sales: productId.sales 

                }
                data.stock = (productId.stock - quantity);
                data.sales = (productId.sales + quantity)

                await Product.findOneAndUpdate({ _id: indexProduct }, data, { new: true }).lean()
            }
            const bill = new Bill(findShoppingCart);
            await bill.save();
            await shopCart.findOneAndRemove({ user: userId });
            return res.send({ message: 'Bill saved', bill });
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}