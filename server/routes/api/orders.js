const express = require('express');
const mongoose = require('mongoose');
const OrderDTO = require('../../dto/orderDTO.js');
const Order = OrderDTO.getModel();
const ProductDTO = require('../../dto/productDTO.js');
const Products = ProductDTO.getModel();

const router = express.Router();

// Submit order
router.post('/:userId/orders', async (req, res) => {
    let order = new Order(req.body);
    let productList = order.productList;
    let result = await Promise.all([
        order.save()
    ]);
    if (result) {
        productList.forEach(async element => {
            let currProduct = await Products.find({'_id': element.productId});
            let currQuantity = currProduct.map(item => {return item.quantity});
            if(currQuantity && currQuantity[0] > 0){
                await Products.updateOne({'_id': element.productId}, {
                    "quantity": (currQuantity[0] - element.quantity)
                });
            }
        });
        res.status(200).json(result);
    }else{
        res.status(400).json([]);
    }
});

//Get orders
router.get('/:userId/orders', async (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.userId)){
        let ordersDB = await Order.find({'userId': req.params.userId});
        let orders = ordersDB.map(element => {
            return {
                "_id": element._id,
                "userId": element.userId,
                "totalPrice": element.totalPrice.toString(),
                "productList": element.productList
            }
        });;
        if (orders.length > 0) {
            res.json(orders);
          }else{
            res.json([]);
          }
    }else{
      res.status(404).json([]);
    }
});

module.exports = router;