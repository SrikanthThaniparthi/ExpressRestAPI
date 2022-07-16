const User = require("../models/user");
const Order = require("../models/order");
const { orderBy } = require("../models/order");


exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json(
                {
                    err: "No user was found in db"
                }
            )
        }
        req.profile = user;
        next();
    })
}


exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined

    return res.json(req.profile);
}


exports.getAllUsers = (req, res) => {
    User.find().exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: err
            })
        }
        return res.status(200).json(user);
    })
}



exports.updateUser = (req, res) => {
    User.findByIdAndUpdate({ _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    err: err
                })
            }
            user.salt = undefined;

            return res.json(user)

        }
    )
}


exports.userPurchaseList = (req, res) => {
    orderBy.find({ user: req.profile._id })
        .populate("User", "_id name")
        .exec((err, order) => {

            if (err) {
                return res.status(400).json({
                    error: "No Order in this Account"
                })


            }
            return res.json(order);
        })

}


exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transction_id: req.body.order.transction_id
        })
    });
    //store this in db

    User.findOneAndUpdate(
        { _id: req.profile.id },
        {$push:{purchases:purchases}},
        {new:true},
        (err,purchase)=>{
            if(err)
            {
                return res.status(400).json({
                    err:"unable to save purchase list"
                })
            }
            next();

        }
    )



}