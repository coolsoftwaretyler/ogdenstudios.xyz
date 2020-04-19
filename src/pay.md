---
layout: layouts/two-column.html
stripe: true
---
<style>
fieldset {
    border: none;
    padding-left: 0;
    padding-right: 0;
}

input[type="text"],
input[type="email"],
input[type="tel"],
#submit {
    font-size: 18px;
    height: 1.5em;
    margin: 0.5em 0;
    width: 100%;
}

#submit {
    background: #5c5552;
    border: none;
    border-radius: 5px;
    color: white;
    margin-top: 1em;
}
</style>

# Pay an invoice

Use the form below to pay your invoice. 

<form id="payment-form">
    <fieldset>
        <label for="name" data-tid="form.name_label">Name</label>
        <input id="name" data-tid="form.name_placeholder" type="text" placeholder="Jane Doe" required="" autocomplete="name"><br>
        <label for="email" data-tid="form.email_label">Email</label>
        <input id="email" data-tid="form.email_placeholder" type="email" placeholder="janedoe@gmail.com" required="" autocomplete="email"><br>
        <label for="invoice" data-tid="form.invoice_label">Invoice</label>
        <input id="invoice" data-tid="form.invoice_placeholder" type="tel" placeholder="XXXX-XXX" required="" autocomplete="tel"><br>
        <label for="amount" data-tid="form.amount_label">Amount (USD)</label>
        <input id="amount" data-tid="form.amount_placeholder" type="text" placeholder="100.00" required="" autocomplete="amount" pattern="^\d+\.\d{2}$"><br>
    </fieldset>
    <fieldset>
        <div id="card-element">
        <!-- Elements will create input elements here -->
        </div>
        <!-- We'll put the error messages in this element -->
        <div id="card-errors" role="alert"></div>
        <button id="submit">Pay</button>
    </fieldset>
</form>

<script>
var stripe = Stripe('pk_test_id24CfaEav8k0e7CumOaGRTY00QQBG5gdL');
var elements = stripe.elements();

var style = {
  base: {
    color: "#32325d",
  }
};
var card = elements.create("card", { style: style });
card.mount("#card-element");

card.addEventListener('change', ({error}) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  var name = document.getElementById('name').value
  var email = document.getElementById('email').value
  var invoice = document.getElementById('invoice').value
  var amount = document.getElementById('amount').value 
  var paymentInformation = {
      name: name,
      email: email,
      invoice: invoice, 
      amount: amount,
      card: card
  }
  fetch('/.netlify/functions/purchase', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentInformation)
  })
  .then(function(response) {
      response.json().then(
          function(json) {
              var clientSecret = json.client_secret
              confirmPayment(clientSecret, paymentInformation)
          }
      )
  });
});

function confirmPayment(clientSecret, paymentInformation) {
  stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: paymentInformation.card,
      billing_details: {
        name: paymentInformation.name,
        email: paymentInformation.email
       },
        metadata: {
            invoice: paymentInformation.invoice
        }
    }
  }).then(function(result) {
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
      window.alert(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        window.alert('Payment successful!')
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  });
}
</script>