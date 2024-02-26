var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Importing required modules
var express = require('express');
// Creating an instance of express
var app = express();
var port = 3000; // Port on which the server will run
// Object to store server URLs
var serverRegistry = {
    'getServer': 'http://localhost:3000' // Example URL, replace with your server's actual URL
};
// Route to handle GET requests for server URLs
app.get('/getServer', function (req, res) {
    var serverUrl = "localhost:".concat(port);
    res.json({ code: 200, server: serverUrl });
});
var products = [
    { id: 1, name: 'Product 1', category: 'Category 1', description: 'Description of Product 1', price: 10.99, inStock: true },
    { id: 2, name: 'Product 2', category: 'Category 2', description: 'Description of Product 2', price: 20.99, inStock: false },
    { id: 3, name: 'Product 3', category: 'Category 1', description: 'Description of Product 3', price: 15.99, inStock: true },
];
app.get('/products', function (req, res) {
    var _a = req.query, category = _a.category, inStock = _a.inStock;
    var filteredProducts = products;
    if (category) {
        filteredProducts = filteredProducts.filter(function (product) { return product.category === category; });
    }
    if (inStock) {
        filteredProducts = filteredProducts.filter(function (product) { return product.inStock; });
    }
    res.json(filteredProducts);
});
app.get('/products/:id', function (req, res) {
    var productId = parseInt(req.params.id);
    var product = products.find(function (product) { return product.id === productId; });
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});
app.use(express.json());
app.post('/products', function (req, res) {
    var _a = req.body, name = _a.name, description = _a.description, price = _a.price, category = _a.category, inStock = _a.inStock;
    if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    var newProduct = {
        id: products.length + 1,
        name: name,
        description: description,
        price: price,
        category: category,
        inStock: inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});
app.put('/products/:id', function (req, res) {
    var productId = parseInt(req.params.id);
    var updatedProductInfo = req.body;
    var productIndex = products.findIndex(function (product) { return product.id === productId; });
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    products[productIndex] = __assign(__assign({}, products[productIndex]), updatedProductInfo);
    res.json(products[productIndex]);
});
var orders = [];
var orderIdCounter = 1;
app.post('/orders', function (req, res) {
    var _a = req.body, userId = _a.userId, products = _a.products;
    if (!userId || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Invalid request body.' });
    }
    var totalPrice = products.reduce(function (total, product) {
        return total + (product.price * product.quantity);
    }, 0);
    var newOrder = {
        orderId: orderIdCounter++,
        userId: userId,
        products: products,
        totalPrice: totalPrice,
        status: 'Pending'
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});
app.get('/orders/:userId', function (req, res) {
    var userId = parseInt(req.params.userId);
    var userOrders = orders.filter(function (order) { return order.userId === userId; });
    res.json(userOrders);
});
var carts = {}; // Store user carts using userId as key
app.use(express.json());
app.post('/cart/:userId', function (req, res) {
    var userId = req.params.userId;
    var _a = req.body, productId = _a.productId, quantity = _a.quantity;
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid request body.' });
    }
    if (!carts[userId]) {
        carts[userId] = [];
    }
    carts[userId].push({ productId: productId, quantity: quantity });
    res.json(carts[userId]);
});
app.get('/cart/:userId', function (req, res) {
    var userId = req.params.userId;
    if (!carts[userId]) {
        return res.status(404).json({ error: 'Cart not found.' });
    }
    res.json(carts[userId]);
});
app.delete('/cart/:userId/item/:productId', function (req, res) {
    var userId = req.params.userId;
    var productId = req.params.productId;
    // Check if the user has a cart
    if (!carts[userId]) {
        return res.status(404).json({ error: 'Cart not found.' });
    }
    carts[userId] = carts[userId].filter(function (item) { return item.productId !== productId; });
    res.json(carts[userId]);
});
app.listen(port, function () {
    console.log("Server is listening at http://localhost:".concat(port));
});
