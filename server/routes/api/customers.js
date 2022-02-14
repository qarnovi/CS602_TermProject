const express = require('express');
const mongoose = require('mongoose');
const UserDTO = require('../../dto/userDTO.js');
const Users = UserDTO.getModel();
const js2xmlparser = require("js2xmlparser");

const router = express.Router();

//Get all customers
router.get('/', async (req, res) => {
    let users = await Users.find();
    if (users) {
        res.format({
            'application/json': function() {
				res.json(users);
			},
            'application/xml': function() {
				res.type('application/xml');
				res.send(js2xmlparser.parse("customers", users));
			},
        });
    }
});

module.exports = router;