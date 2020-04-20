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
#submit,
#statusClose,
#card-element {
    box-sizing: border-box;
    font-size: 18px;
    height: 2.25em;
    margin: 0.5em 0;
    padding-left: 0.25em;
    width: 100%;
}

#card-element {
  margin-bottom: 0;
}

#submit,
#statusClose {
    background: #5c5552;
    border: none;
    border-radius: 5px;
    color: white;
    margin-top: 1em;
    padding-left: 0;
}

#statusClose {
  display: none;
}

#status {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  height: 100%;
  width: 100%;
  display: none;
}

#status.active {
  display: block;
}

#status .info {
  background: #5c5552;
  box-sizing: border-box;
  color: white;
  padding: 1em;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 500px;
}

.lds-dual-ring {
  display: block;
  margin: 0 auto;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: '';
  display: block;
  width: 64px;
  height: 64px;
  margin: 2px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
        <input id="invoice" data-tid="form.invoice_placeholder" type="tel" placeholder="XXXX-XXX" autocomplete="tel"><br>
        <label for="amount" data-tid="form.amount_label">Amount (USD)</label>
        <input id="amount" data-tid="form.amount_placeholder" type="text" placeholder="100.00" required="" autocomplete="amount" pattern="(?=.*?\d)^\$?(([1-9]\d{0,2}(\d{3})*)|\d+)?(\.\d{1,2})?$"><br>
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

<div id="status">
  <div class="info">
    <p id="statusMessage">Payment processing</p>
    <div class="lds-dual-ring"></div>
    <button id="statusClose">Close</button>
  </div>
</div>

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
  document.getElementById('status').classList.add('active');
  var name = document.getElementById('name').value
  var email = document.getElementById('email').value
  var invoice = document.getElementById('invoice').value
  var amount = document.getElementById('amount').value * 100
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
    document.querySelector(".lds-dual-ring").style.display = 'none';
    document.querySelector("#statusClose").style.display = 'block';
    if (result.error) {
      document.getElementById('statusMessage').innerText = result.error.message
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        document.getElementById('statusMessage').innerText = 'Your payment for $' + result.paymentIntent.amount / 100 + ' was successful. Thank you!' 
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  });
}

var closeButton = document.getElementById('statusClose').addEventListener('click', function() {
  document.getElementById('statusMessage').innerText = 'Payment processing';
  document.querySelector(".lds-dual-ring").style.display = 'block';
  document.querySelector("#statusClose").style.display = 'none';
  document.getElementById('status').classList.remove('active');
})
</script>