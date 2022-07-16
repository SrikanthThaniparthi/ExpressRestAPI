const express = require("express");
const router = express.Router();
const {isSignedIn,isAuthenticated,isAdmin } = require("../controllers/auth");
const {gettoken,processPayment}=require("./../controllers/Payment")



router.get("/payment/gettoken/:userId",isSignedIn,isAuthenticated,gettoken);

router.post("/payment/braintree/:userId",processPayment)






module.exports = router;