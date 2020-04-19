---
layout: layouts/two-column.html
title: Pay
---
<script src="https://js.stripe.com/v3/"></script>
<style>
fieldset {
    border: none;
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
        <input id="invoice" data-tid="form.invoice_placeholder" type="tel" placeholder="2020-000" required="" autocomplete="tel"><br>
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
</script>