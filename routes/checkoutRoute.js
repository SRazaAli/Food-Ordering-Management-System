const express = require('express');
const path = require('path');
const router = express.Router();
const connectToDatabase = require('../config/dbconfig');

// Middleware to parse JSON data
router.use(express.json());

// Route to handle checkout data
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/checkout.html'));
});

router.post('/', async(req, res) => {
    const { cart, totalItems, totalPrice, deliveryAgent, paymentMethod } = req.body;

    // Validate the received data
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: 'Invalid cart data' });
    }

    if (!deliveryAgent || !paymentMethod) {
        return res.status(400).json({ message: 'Delivery agent and payment method are required' });
    }

    // Example: Log the received data (for debugging)
    const session = req.session;
    console.log('Checkout Data:', {
        cart,
        totalItems,
        totalPrice,
        deliveryAgent,
        paymentMethod,
        session    
    });

    // Process the checkout data (e.g., save to database, send confirmation email, etc.)
    // Here, we'll assume it's processed successfully.




    try {
        const connection = await connectToDatabase();
    
        // Step 1: Insert the user as a Customer
        const insertCustomerQuery = `
            INSERT INTO Customer (UserID, LoyaltyPoints)
            OUTPUT INSERTED.CustomerID 
            VALUES (?, 10);
        `;
        const [result] = await connection.query(insertCustomerQuery, [session.UserID]); 
        const customerID = result.recordSet[0].CustomerID; // Retrieve the autogenerated CustomerID
        console.log(customerID);
    
    } catch (err) {
        console.log(err);
    }
    
    
    
    
    // Redirect to a checkout summary page
    res.status(200).json({
        message: 'Checkout successful',
        summary: {
            cart,
            totalItems,
            totalPrice,
            deliveryAgent,
            paymentMethod,
            session
        }
    });
});

// Export the router
module.exports = router;