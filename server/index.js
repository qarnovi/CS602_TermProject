const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const products = require('./routes/api/products');
const cartProducts = require('./routes/api/cartProducts');
const orders = require('./routes/api/orders');
const customers = require('./routes/api/customers');

app.use('/', products);
app.use('/api/users', cartProducts);
app.use('/api/orders', orders);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server started on port ' + port));