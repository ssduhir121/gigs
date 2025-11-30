// utils/paypalPayoutsClient.js
const paypalPayouts = require('@paypal/payouts-sdk');

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials in environment variables.');
  }

  if (process.env.PAYPAL_ENV === 'live') {
    return new paypalPayouts.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypalPayouts.core.SandboxEnvironment(clientId, clientSecret);
}

function payoutsClient() {
  return new paypalPayouts.core.PayPalHttpClient(environment());
}

module.exports = { payoutsClient, paypalPayouts };