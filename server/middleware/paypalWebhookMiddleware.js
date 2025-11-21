// middleware/paypalWebhookMiddleware.js
const { client } = require('../utils/paypalClient');

exports.verifyWebhook = async (req, res, next) => {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const transmissionId = req.headers['paypal-transmission-id'];
    const timestamp = req.headers['paypal-transmission-time'];
    const signature = req.headers['paypal-transmission-sig'];
    const certUrl = req.headers['paypal-cert-url'];
    const authAlgo = req.headers['paypal-auth-algo'];

    if (!webhookId) {
      console.error('❌ Missing PAYPAL_WEBHOOK_ID in environment.');
      return res.status(500).send('Server misconfiguration');
    }

    const verifyRequest = new (require('@paypal/checkout-server-sdk').core.PayPalHttpRequest)(
      '/v1/notifications/verify-webhook-signature'
    );

    verifyRequest.method = 'POST';
    verifyRequest.requestBody({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: signature,
      transmission_time: timestamp,
      webhook_id: webhookId,
      webhook_event: req.body,
    });

    const verifyResponse = await client().execute(verifyRequest);
    const verificationStatus = verifyResponse.result?.verification_status;

    if (verificationStatus !== 'SUCCESS') {
      console.error('❌ PayPal Webhook Verification Failed');
      return res.status(400).send('Webhook verification failed');
    }

    next();
  } catch (err) {
    console.error('❌ Error verifying PayPal webhook:', err.message || err);
    return res.status(400).send('Webhook verification failed');
  }
};
