require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = function(event, context, callback) {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'usd',
      metadata: {integration_check: 'accept_a_payment'},
    });
}