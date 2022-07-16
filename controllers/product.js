const Products = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
    Products.findById(id)
        .populate("category")
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Product Not Found"
                })
            }
            req.product = products;
            next()
        })
}


exports.createProduct = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                err: "Problem With Image"
            })
        }

        //descture fileds

        const { price, name, description, category, stock } = fields;
        if (
            !name ||
            !description ||
            !category ||
            !stock) {
            return res.status(400).json({
                err: "Please Include all Fields"
            })
        }
        //to do restrictions on filed

        let product = new Products(fields);

        //handle file

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    err: "File Size To Big"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;


        }
        //save to the db
        product.save((err, product) => {
            if (err) {
                return res.json({
                    err: "Saving T shirt in db"
                })
            }
            return res.json(product);
        })


    });
    //const product=new Products(req.body);

    // product.save()
}


exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
      res.set("Content-Type", req.product.photo.contentType);
      return res.send(req.product.photo.data);
    }
    next();
  };


//delete

exports.deleteProduct = (req, res) => {

    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.json("Failued to delete product")
        }
        return res.json({
            message: "deleted successfule",
            deletedProduct: deletedProduct
        })
    })
}

//update product

exports.updateProduct = (req, res) => {


    let form = new formidable.IncomingForm();
    console.log(form)

    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        console.log(req);
        if (err) {
            return res.status(400).json({
                err: "Problem With Image"
            })
        }

        //descture fileds

        const { price, name, description, category, stock } = fields;

        console.log(fields)
        if (
            !name ||
            !description ||
            !category ||
            !stock) {
            return res.status(400).json({
                err: "Please Include all Fields"
            })
        }
        //to do restrictions on filed

        let product = req.product;
        product = _.extend(product, fields)

        //handle file

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    err: "File Size To Big"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
           


        }
        //save to the db
        product.save((err, product) => {
            if (err) {
                
                return res.json({
                    err: "Updating failed product T shirt in db"
                    
                })
            }
           
            return res.json(product);
        })


    });

}


exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  
    product.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy, "asc"]])
      .limit(limit)
      .exec((err, products) => {
        if (err) {
          return res.status(400).json({
            error: "NO product FOUND"
          });
        }
        res.json(products);
      });
  };
  
// exports.getAllProducts = (req, res) => {
//     // let limit = req.query.limit ? parseInt(req.query.limit) : "8"
//     // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
//     Products.find()
//         // select("-photo")
//         // .populate("category")
//         // .limit(limit)
//         // .sort([[sortBy, "asc"]])
//         .exec((err, products) => {
//             if (err) {
//                 return res.status(400).json({
//                     err: "no prodcuts"
//                 })
//             }

//             return res.json(products);
//         })

// }




exports.updateStock = (req, res) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: {
                    $inc: {
                        stock: -prod.count, sold: +prod.count
                    }
                }
            }
        }

    })









    product.bulkWrite(
        myOperations, {}, (err, products) => {
            if (err) {
                return res.status(400).json({
                    err: "bulk operation failed"
                })
            }

            next()
        }

    )
}



exports.getAlluniqueCategories = (req, res) => {
    Products.distinct("category", {}, (err, categor => [

    ]));
}

