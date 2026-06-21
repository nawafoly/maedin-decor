# Payment gateway setup

The checkout uses a Moyasar hosted invoice. The amount is selected by the Worker,
not accepted from the browser. Every attempt is written to the Firestore
`paymentTransactions` collection and reconciled against Moyasar before it is
marked as paid.

## Required Worker secrets

Set these with `npx wrangler secret put NAME --config workers/wrangler.toml`:

- `MOYASAR_SECRET_KEY`: Moyasar test or live secret API key.
- `PAYMENT_CALLBACK_SECRET`: a long random value used on per-invoice callbacks.
- `FIREBASE_CLIENT_EMAIL`: service account email for the Firebase project.
- `FIREBASE_PRIVATE_KEY`: matching PKCS#8 private key, including PEM markers.
- `RESEND_API_KEY`: Resend API key for customer and admin notifications.

The Firebase service account only needs permission to read and write Firestore.
Never expose these values through a `VITE_` variable.

## Required Worker variables

Add production values under `[vars]` in `workers/wrangler.toml` or in the
Cloudflare dashboard:

```toml
APP_URL = "https://example.com"
CONSULTATION_AMOUNT_SAR = "650"
FIREBASE_PROJECT_ID = "maedin-decor"
RESEND_FROM = "FORMA <notifications@your-verified-domain.com>"
ADMIN_EMAIL = "nawafoly0@gmail.com"
```

The frontend deployment needs:

```text
VITE_PAYMENT_ENDPOINT=https://YOUR_WORKER_DOMAIN/api/payments/checkout
VITE_CONSULTATION_AMOUNT_SAR=650
```

Keep the public display amount and Worker amount aligned. The Worker value is
authoritative. Deploy `firestore.rules`, build the site, and then deploy the
Worker after all secrets are present. Test with Moyasar test keys before using
live keys.
