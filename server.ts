// Importing required modules
const express = require('express');

// Creating an instance of express
const app = express();
const port = 3000; // Port on which the server will run

// Object to store server URLs
const serverRegistry = {
    'getServer': 'http://localhost:3000' // Example URL, replace with your server's actual URL
};

// Route to handle GET requests for server URLs
app.get('/getServer', (req, res) => {
    const serverUrl = `localhost:${port}`;
    res.json({ code: 200, server: serverUrl });
});

const products = [
    { id: 1, name: 'Product 1', category: 'Category 1', description: 'Description of Product 1', price: 10.99, inStock: true },
    { id: 2, name: 'Product 2', category: 'Category 2', description: 'Description of Product 2', price: 20.99, inStock: false },
    { id: 3, name: 'Product 3', category: 'Category 1', description: 'Description of Product 3', price: 15.99, inStock: true },
];


app.get('/products', (req, res) => {

    const { category, inStock } = req.query;

    let filteredProducts = products;
    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    if (inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    res.json(filteredProducts);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(product => product.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

app.use(express.json());

app.post('/products', (req, res) => {

    const { name, description, price, category, inStock } = req.body;


    if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }


    const newProduct = {
        id: products.length + 1,
        name,
        description,
        price,
        category,
        inStock
    };


    products.push(newProduct);


    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProductInfo = req.body;
    const productIndex = products.findIndex(product => product.id === productId);


    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }


    products[productIndex] = { ...products[productIndex], ...updatedProductInfo };


    res.json(products[productIndex]);
});

let orders = [];
let orderIdCounter = 1;




app.post('/orders', (req, res) => {
    const { userId, products } = req.body;


    if (!userId || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Invalid request body.' });
    }


    const totalPrice = products.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);


    const newOrder = {
        orderId: orderIdCounter++,
        userId,
        products,
        totalPrice,
        status: 'Pending'
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
});


app.get('/orders/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);


    const userOrders = orders.filter(order => order.userId === userId);


    res.json(userOrders);
});


const carts = {}; // Store user carts using userId as key


app.use(express.json());


app.post('/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid request body.' });
    }


    if (!carts[userId]) {
        carts[userId] = [];
    }


    carts[userId].push({ productId, quantity });


    res.json(carts[userId]);
});


app.get('/cart/:userId', (req, res) => {
    const userId = req.params.userId;

    if (!carts[userId]) {
        return res.status(404).json({ error: 'Cart not found.' });
    }


    res.json(carts[userId]);
});


app.delete('/cart/:userId/item/:productId', (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Check if the user has a cart
    if (!carts[userId]) {
        return res.status(404).json({ error: 'Cart not found.' });
    }


    carts[userId] = carts[userId].filter(item => item.productId !== productId);


    res.json(carts[userId]);
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
