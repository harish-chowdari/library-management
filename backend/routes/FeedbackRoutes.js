const express = require("express");
const { sendFeedback, getFeedbacks } = require("../controllers/FeedbackController");
const router = express.Router();


router.post("/send-feedback", sendFeedback)


router.get("/all-feedbacks/:bookId", getFeedbacks)


module.exports = router

