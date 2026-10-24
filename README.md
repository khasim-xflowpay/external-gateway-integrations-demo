# External gateway integrations demo

A demo merchant page (CloudSuite) paying through two external gateways, to compare their checkout experience with Xflow's hosted checkout:

| Route | Gateway | Integration |
| --- | --- | --- |
| `/razorpay-checkout` | Razorpay | Standard Checkout: the server creates an order (Orders API), the page opens `checkout.js` with the `order_id` |
| `/stripe-checkout` | Stripe | Embedded Checkout: the server creates a Checkout Session, the page mounts it with `@stripe/react-stripe-js` |
| `/return` | Stripe | Return page after a Stripe payment, reads the session status |

## Run locally

```bash
cp .env.example .env   # add your test keys
yarn install
yarn dev
```

`yarn dev` starts the API server on `:8787` and Vite on `:5173` (Vite proxies `/api`, `/create-checkout-session` and `/session-status` to the API server). Vite also listens on your network address, so a phone on the same Wi-Fi can open the page, which is how to see Razorpay's UPI Intent on mobile web.

## Notes

- Razorpay only shows the methods enabled on the account. UPI must be enabled on the account for UPI options to appear.
- The Razorpay success handler only logs the payment IDs. A real integration must verify `razorpay_signature` on the server before treating the payment as successful.
- Keys live in `.env`, which is not committed.
