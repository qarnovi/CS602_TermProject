const express = require('express');
const mongoose = require('mongoose');
const UserDTO = require('../../dto/userDTO.js');
const Users = UserDTO.getModel();
const ProductDTO = require('../../dto/productDTO.js');
const Products = ProductDTO.getModel();
const js2xmlparser = require("js2xmlparser");

const router = express.Router();

// Get cart items for the user
router.get('/:userId/cart', async (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.userId)) {
      let user = await Users.findById(req.params.userId);
      if (user) {
          let cartItemIds = [];
          let cartItemsArr = user.cartItems;
          cartItemsArr.forEach(element => {
            cartItemIds.push(element.productId);
          });
          let products = await Products.find({'_id': { $in: cartItemIds}});
          let results = products.map( p => {
            return {
              id: p._id,
              name: p.name,
              description: p.description,
              price: p.price.toString()
            }
        });
        let newResults = []
        cartItemsArr.forEach(element => {
          results.forEach(p => {
            if (element.productId.toString() === p.id.toString()) {
              newResults.push({
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price.toString(),
                quantity: element.quantity,
                userId: user._id
              });
            }
          })
        })
        if (newResults.length > 0) {
          res.format({
            'application/json': function() {
            res.json(newResults);
            },
            'application/xml': function() {
            res.type('application/xml');
            res.send(js2xmlparser.parse("cartItems", newResults));
            }
          });
        }else{
          res.status(404);
          res.format({
            'application/json': function() {
            res.json([]);
            },
            'application/xml': function() {
            res.type('application/xml');
            res.send(js2xmlparser.parse("cartItems", []));
            }
          });
        }
      }else{
        res.status(404).json([]);
      }
    }else{
      res.status(404).json([]);
    }
  });

  //Add to cart of the user
  router.post('/:userId/cart', async (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.userId) && 
        mongoose.Types.ObjectId.isValid(req.body.productId)){
        
        let product = await Products.find({'_id': req.body.productId});
        if (product) {
            let user = await Users.findById(req.params.userId);
            if (user){
                user.cartItems.push({"productId": req.body.productId, "quantity": req.body.quantity});
                user.save();
                res.status(200);
                res.format({
                  'application/json': function() {
                    res.json([{"added": true, "id": req.body.productId}]);
                    },
                    'application/xml': function() {
                    res.type('application/xml');
                    res.send(js2xmlparser.parse("addedToCart", [{"added": true, "id": req.body.productId}]));
                    }
                });
            }else{
              res.status(404);
              res.format({
                'application/json': function() {
                  res.json([{"added": false, "id": req.body.productId}]);
                  },
                  'application/xml': function() {
                  res.type('application/xml');
                  res.send(js2xmlparser.parse("addedToCart", [{"added": false, "id": req.body.productId}]));
                  }
              });
            }
        }else{
          res.status(404);
          res.format({
            'application/json': function() {
            res.json([]);
            },
            'application/xml': function() {
            res.type('application/xml');
            res.send(js2xmlparser.parse("addedToCart", []));
            }
          });
        }
    }
  });

  // Remove cart items for the user
  router.delete('/:userId/cart/:id', async (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.userId) && 
    mongoose.Types.ObjectId.isValid(req.params.id)){
    
        let product = await Products.find({'_id': req.params.id});
        if (product) {
            let user = await Users.findById(req.params.userId);
            if (user){
              let arr = user.cartItems;
              let newArr = []
              arr.forEach(element => {
                if(element.productId != req.params.id){
                  newArr.push(element);
                }
              });
              user.cartItems = newArr;
              user.cartItems = user.cartItems.filter(product => product.id !== req.params.id);
              await user.save();
              let cartItemIds = [];
              user.cartItems.forEach(element => {
                cartItemIds.push(element.productId);
              });
              products = await Products.find({'_id': { $in: cartItemIds}});
              let results = products.map( p => {
                return {
                    id: p._id,
                    name: p.name,
                    description: p.description,
                    price: p.price.toString(),
                    quantity: p.quantity
                }
              });
                res.status(200);
                res.format({
                  'application/json': function() {
                    res.json(results);
                    },
                    'application/xml': function() {
                    res.type('application/xml');
                    res.send(js2xmlparser.parse("removedFromCart", results));
                    }
                });
            }else{
              res.status(404);
              res.format({
                'application/json': function() {
                  res.json([{"removed": false, "id": req.body.id}]);
                  },
                  'application/xml': function() {
                  res.type('application/xml');
                  res.send(js2xmlparser.parse("removedFromCart", [{"removed": false, "id": req.body.id}]));
                  }
              });
            }
        }else{
            res.status(404).json([]);
        }
    }
  });

  module.exports = router;