require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context, callback) {
    // Require a POST
    if (!event.body || event.httpMethod !== 'POST') {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                status: 'invalid-method'
            })
        }
    }

    const data = JSON.parse(event.body)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: 'accept_a_payment' },
    });
    return {
        statusCode: 200,
        body: JSON.stringify(paymentIntent)
    }
}