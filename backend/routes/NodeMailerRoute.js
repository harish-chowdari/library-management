const { sendEmail, checkReserved, emailsSentHistory, getEmailsHistory, checkEmailAlreadySent } = require('../controllers/NodeMailer');

const router = require('express').Router();




router.post('/send-email', sendEmail);


router.get("/check-reservation", checkReserved)
 

router.post("/emails-sent-history", emailsSentHistory)


router.get("/get-emails-sent-history", getEmailsHistory)

 



module.exports = router;  
