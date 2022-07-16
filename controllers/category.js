const Category = require("../models/category")


exports.getCategoryByID = (req, res, next, id) => {

    Category.findById(id).exec((err, cate) => {
        if (err) {
            return res.status(400).json({
                err: "no category found in db",
                msg:err
            })
        }
        req.category = cate;
        next();
    })



}

exports.createCategory = (req,res) => {

    const category = new Category(req.body);
    category.save((err, cate) => {
        if (err || !cate) {
            return res.status(400).json({
                err: "Not able to save category in db"
            })
        }
        return res.json(cate);
    })




}


exports.getCategory = (req, res) => {

    return res.json(req.category);

}


exports.getAllCategoris = (req, res) => {

    Category.find().exec((err, categories) => {
        if (err) {
            return res.json({
                err: "No categories found in db"
            })
        }
        return res.json(categories);
    })
}

exports.updateCategory = (req, res) => {

    const category = req.category;
    category.name = req.body.name

    category.save((err,updatedCategory)=>{
        if (err) {
            return res.json({
                err: "Failed to update category"
            })
        }
        return res.json(updatedCategory);
    })

}

exports.deleteCategory=(req,res)=>{


const category=req.category;
category.remove((err,deleteCategory)=>{
    if(err){
        return res.json({
            err: "Failed to Delete category"
        }) 
    }

    return res.json({
     message: `successfull delete${deleteCategory}`});
});

}