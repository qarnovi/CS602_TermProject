const express = require('express');
const mongoose = require('mongoose');
const ProductDTO = require('../../dto/productDTO.js');
const Products = ProductDTO.getModel();

const router = express.Router();

//GET products ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPxuP6C/4EI10o1+TJctv8jimXVqVxKS2Rznm7K4eRv9 surhon.juraholov@gmail.com

router.get('/api/products', async (req, res) => {
    let products = await Products.find({})
    let results = products.map( product => {
        return {
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            quantity: product.quantity
        }
    });
    res.json(results);
});

router.get('/api/products/:id', async (req, res) => {
  if(mongoose.Types.ObjectId.isValid(req.params.id)) {
    let product = await Products.find({'_id': req.params.id})
    let results = product.map( p => {
        return {
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price.toString(),
            quantity: p.quantity
        }
    });
    if (results) {
      res.json(results);
    }else{
      res.json([]);
    }
  }else{
    res.status(404);
    res.json([]);
  }
  
});

//Add Products
router.post('/api/products', async (req, res) => {
    let product = new Products({
        name: req.body.product.name,
        description: req.body.product.description,
        price: req.body.product.price,
        quantity: req.body.product.quantity
    });
    await Promise.all([
        product.save()
    ]);
    res.status(200).json(product);
});

//Edit a product
router.put('/api/products/:id', async (req, res) => {
  Products.findById(req.params.id, async function (err, product) {
    if(err){
      console.log('Error Selecting : %s', err);
      res.status(404).json({"errorMessage": "could not find the product"});
    }
    if(!product){
      res.status(404).json({"errorMessage": "could not find the product"});
    }else{
      let quesryResult = await product.updateOne({
        name: req.body.product.name,
        description: req.body.product.description,
        price: req.body.product.price,
        quantity: req.body.product.quantity
      });
      if (quesryResult.modifiedCount == 1) {
        res.status(200).json(quesryResult);
      }else{
        res.status(404).json({"errorMessage": "could not edit the product"});
      }
    }
  });
});

//Delete products
router.delete('/api/products/:id', async (req, res) => {
    Products.findById(req.params.id, async function (err, product) {
      if(err){
        console.log('Error Selecting : %s', err);
        res.status(404).send();
      }
      if(!product){
        res.status(404).send();
      }else{
        let result = await product.remove();
        res.status(200).json(result);
      }
    });
});

module.exports = router;