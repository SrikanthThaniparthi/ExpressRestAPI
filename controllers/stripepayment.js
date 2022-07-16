const stripe = require("stripe")("sk_test_51LLVgLSIZPGMuewvlq5gwPyJjVQUcujSJs7WG7lp8Ee7n1uclrHI3FQMc5TaWEcB5CL4SAkdSLOVYaJzqZnLbcpY00Rq8Fxn7b")
const uuid = require("uuid/v4")


exports.makePayment = (req, res) => {
    const { products, token } = req.body;

    console.log("Prodcuts", products);

    let amount = 0;

    products.map((produt, index) => {
        amount = produt.price + amount
    });

    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then((customer => {
        stripe.charges.create({
            amount:amount,
            currency:'usd',
            customer:customer.id,
            receipt_email:token.email,
            shipping:{
                name:token.card.name,

            }

        }, { idempotencyKey })
            .then(res => {
                return res.status(200).json(res)
            })
            .catch(err=>console.log(err));
    }))
}