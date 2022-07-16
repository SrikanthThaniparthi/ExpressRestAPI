const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "7h6bh5d9qttyncmt",
  publicKey: "vgv65q9yc3jcqqts",
  privateKey: "4d5be1d0e414f601bfb2356692ddfc1e"
});



exports.gettoken = (req, res) => {
  gateway.clientToken.generate({
    customerId: req.id
  }, (err, response) => {
    // pass clientToken to your front-end
    if (err) {
      res.status(500)
    }
    {
      res.send(response);
      console.log(response)
    }
  });
}

exports.processPayment = (req, res) => {
  let nonseFeomClient = req.body.paymentMethodNonce;
  console.log(req.body.paymentMethodNonce)


  let amountFromClient = req.body.amount;
  gateway.transaction.sale({
    amount: amountFromClient,
    paymentMethodNonce: nonceFromTheClient,
    deviceData: deviceDataFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if (err) {
      res.json(err)
    }
    else {
      res.json(result);
    }
  });
}