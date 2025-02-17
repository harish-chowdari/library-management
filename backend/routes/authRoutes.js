const express = require("express");
const router = express.Router();

const  {createLibrarianAccount,librarianLogin, createUserAccount, userLogin, getUserById, getLibrarianById} = require("../controllers/authControllers");
const { route } = require("./librarianRoutes");



router.post("/create-librarian-account", createLibrarianAccount)

router.post("/librarian-login",librarianLogin)

router.get("/get-librarian-by-id/:id", getLibrarianById)

// user routes

router.post("/create-user-account", createUserAccount)

router.post("/user-login", userLogin)

router.get("/get-user-by-id/:id", getUserById)


module.exports = router;