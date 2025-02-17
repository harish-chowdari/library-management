const express = require("express");
const {  addToSubmit, getSubmissionsByUserId } = require("../controllers/SubmissionController");
const router = express.Router();


router.post("/submit-book", addToSubmit )

router.get("/get-submissions/:userId", getSubmissionsByUserId )




module.exports = router