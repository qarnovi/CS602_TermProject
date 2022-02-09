const express = require('express');
const ProductDTO = require('../../dto/productDTO.js');
const Products = ProductDTO.getModel();

const router = express.Router();

//GET products ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPxuP6C/4EI10o1+TJctv8jimXVqVxKS2Rznm7K4eRv9 surhon.juraholov@gmail.com

router.get('/', async (req, res) => {
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

//Add Products
router.post('/', async (req, res) => {
    let product = new Products({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.price
    });
    await Promise.all([
        product.save()
    ]);
    res.status(201).send();
});

//Delete products
router.delete('/:id', async (req, res) => {
    Products.findById(req.params.id, function (err, product) {
      if(err){
        console.log('Error Selecting : %s', err);
        res.status(404).send();
      }
      if(!product){
        res.status(404).send();
      }else{
        product.remove();
        res.status(200).send();
      }
    });
});

module.exports = router;