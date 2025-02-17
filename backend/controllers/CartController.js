const Cart = require("../models/CartModel");

async function addToCart(req, res) {
    try { 
        const { userId, bookId } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [{ bookId }] });
        } else {
            const existingItemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
            if (existingItemIndex !== -1) {
                return res.status(200).json({ alreadyAdded: "Book already added to cart" });
            }
            cart.items.push({ bookId });
        }
        await cart.save();
        res.status(200).json({ message: "Item added to cart successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function getCartItemsByUserId(req, res) {
    try {
        const { userId } = req.params;

        // Check if userId is null or undefined
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
 
        // If userId is "null", treat it as a string literal
        if (userId === "null") {
            return res.status(200).json({ message: "Cart not found for the user" });
        }
 
        const cart = await Cart.findOne({ userId }).populate('items.bookId');
        if (!cart) {
            return res.status(200).json({ message: "Cart not found for the user" });
        }
        res.status(200).json({ userId: cart.userId, items: cart.items });
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ message: error.message });
    } 
}

 



async function getCartItems(req, res) {
    try {
        const cart = await Cart.find().populate('items.bookId');
       
        res.status(200).json(cart);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: error.message });
    } 
}




async function removeFromCart(req, res) {
    try {
        const { userId, bookId } = req.body;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for the user" });
        }
        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
        await cart.save();
        res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

 

async function removeFromEveryOnesCart(req, res) {
    try {
        const { bookId } = req.body;

        // Fetch all carts
        const carts = await Cart.find({});

        // Remove the bookId from all carts
        for (const cart of carts) {
            const updatedItems = cart.items.filter(item => item.bookId.toString() !== bookId);
            cart.items = updatedItems;
            await cart.save(); // Save the updated cart
        }

        // Send success response
        res.status(200).json({ message: "Book removed from all carts successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while removing the book from carts" });
    }
}









module.exports = {
    addToCart,
    getCartItemsByUserId,
    getCartItems,
    removeFromCart,
    removeFromEveryOnesCart
};