const ProductDB = require('./dto/productDTO.js');
const UserDB = require('./dto/userDTO.js')

const Product = ProductDB.getModel();
const User = UserDB.getModel();

(async() => {

	await Product.deleteMany({});
	await User.deleteMany({});

	let product1 = new Product({
		name: 'Apple Watch',
		description: 'Apple Watch 7 series',
		price: 399.99,
		quantity: 7
	}); 

	let product2 = new Product({
		name: 'Apple Iphone 13Pro',
		description: 'Apple Watch Iphone 13Pro, 5G',
		price: 999.99,
		quantity: 5
	}); 

	let product3 = new Product({
		name: 'MacBook Pro',
		description: 'MacBook Pro, 15-inch, 2.6 GHz 6-Core Intel i7, 16GB RAM, 512GB SSD',
		price: 2299.99,
		quantity: 10
	}); 

	let product4 = new Product({
		name: 'DELL Laptop',
		description: 'DELL Laptop, 15-inch, 3.0 GHz 8-Core Intel i9, 32GB RAM, 1TB SSD',
		price: 1689.99,
		quantity: 10
	}); 

	let user1 = new User({
		name: 'customer_1',
		cartItems: [
			{
				"productId": "61f9d14de3b89305eef7e04b",
				"quantity": 2
			}
		],
		orders: ["123456"]
	});

	let user2 = new User({
		name: 'customer_2',
		cartItems: [
			{
				"productId": "61f9d14de3b89305eef7e04c",
				"quantity": 3
			}
		],
		orders: ["12345664738"]
	});


	await Promise.all([
			product1.save(), 
			product2.save(), 
			product3.save(),
			product4.save(),
			user1.save(),
			user2.save()
		]);

	let currentProducts = await Product.find({});

	console.log(currentProducts);

	process.exit();


})();












