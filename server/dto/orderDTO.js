const mongoose = require('mongoose');

const credentials = require("../environment/credentials.js");

const dbUrl = 'mongodb://' + credentials.username +
	':' + credentials.password + '@' + credentials.host + '/' + credentials.database;

let connection = null;
let model = null;

let Schema = mongoose.Schema;

let orderSchema = new Schema({
	userId: 'string',
	totalPrice: mongoose.Decimal128,
	productList: []
}, {
	collection: 'orders'
});

module.exports = {	
	getModel: () => {
		if (connection == null) {
			console.log("Creating connection and model...");
			connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
			model = connection.model("OrderModel", 
			orderSchema);
		};
		return model;
	},
	closeConnection: () => {
		if (connection != null){
			console.log("Closing connection");
			connection.close();
		}
	}
};