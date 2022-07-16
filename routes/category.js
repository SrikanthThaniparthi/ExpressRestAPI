const express = require("express");
const router = express.Router();
const {getCategoryByID,createCategory,getCategory,getAllCategoris,updateCategory,deleteCategory} = require("../controllers/category");
const { isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const { getUserById} = require("../controllers/user")

//params
router.param("userId",getUserById);
router.param("categoryId",getCategoryByID);



//actual routes goes here
//create
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);


//read routes
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategoris);

//update routes

router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory);

//delete routes

router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteCategory)





module.exports = router;