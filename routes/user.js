var express = require("express");
var router = express.Router();
const User = require("../models/user");

const {getUserById,getUser,getAllUsers,updateUser,userPurchaseList}=require("../controllers/user")
const {isSignedIn,isAuthenticated,isAdmin,}=require("../controllers/auth")

router.param("userId",getUserById)

 router.get("/user/:userId", getUser);
router.get("/users",getAllUsers);

router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser);

router.get("/order/user/:userID",isSignedIn,isAuthenticated,userPurchaseList)





module.exports = router;
