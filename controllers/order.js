const { Order, ProductCart } = require("./../models/order");



exports.getOrderById = (req, res, id, next) => {

    Order.findById(id).exec
        .populate("products.product", "name price")
        ((err, order) => {
            if (err) {
                return res.status(400).json({
                    err: "no order found on db"
                })
            }
            req.order = order;
        })
}


exports.createOrder = (req, res) => {

    req.param.order.user = req.profile;
    const order = new Order(req.body);
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "failed to save order in db"
            })
        }
        res.json(order);
    })


}


exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "i found no orders  found on db"
                })
            }

            return res.json(order);
        })
}


exports.getOrderStatus = (req, res) => {
    return res.json(Order.schema.path("status").enumValues);

}

exports.updateStatus = (req, res) => {

    Order.update({
        _id: req.body.orderId
    }, {
        $set: { status: req.body.status }
    }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: "Can not update status"
            })
        }
        return res.json(order);
    })

}



