const express = require("express");
const { addToCart, getCartItemsByUserId, removeFromCart, getCartItems, removeFromEveryOnesCart } = require("../controllers/CartController");
const router = express.Router();



router.post("/add-to-cart", addToCart )


router.get("/get-cart/:userId", getCartItemsByUserId)


router.get("/get-cart-items", getCartItems)


router.post("/remove-from-cart", removeFromCart)
 
 
router.post("/remove-from-everyones-cart", removeFromEveryOnesCart)



module.exports = router