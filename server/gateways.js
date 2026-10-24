// Gateway calls shared by the local Express server (server/index.js) and the Vercel functions (api/*.js).
// Each handler returns { status, body } so both can send it as JSON.

// Node server SDK (Orders API, etc.) — not the browser Checkout script (checkout.razorpay.com/v1/checkout.js).
import Razorpay from "razorpay";
import Stripe from "stripe";

/** Trim whitespace; strip accidental surrounding quotes from .env copy-paste */
function trimEnv(value) {
	if (typeof value !== "string") return value;
	let s = value.trim();
	if (
		(s.startsWith('"') && s.endsWith('"')) ||
		(s.startsWith("'") && s.endsWith("'"))
	) {
		s = s.slice(1, -1).trim();
	}
	return s;
}

const stripeSecret = trimEnv(process.env.STRIPE_SECRET_KEY);
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;
if (!stripe) {
	console.warn(
		"[server] Add STRIPE_SECRET_KEY to .env for Stripe Embedded Checkout (see .env.example).",
	);
}

const key_id = trimEnv(process.env.RAZORPAY_KEY_ID);
const key_secret = trimEnv(process.env.RAZORPAY_KEY_SECRET);

const razorpay =
	key_id && key_secret ? new Razorpay({ key_id, key_secret }) : null;

if (!razorpay) {
	console.warn(
		"[server] Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env (see .env.example). Order API will return 503 until configured.",
	);
}

/** POST /api/create-order — Razorpay order for Standard Checkout */
export async function createRazorpayOrder(body) {
	if (!razorpay || !key_id) {
		return {
			status: 503,
			body: {
				error:
					"Missing Razorpay keys. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (test mode from Dashboard).",
			},
		};
	}

	const amountPaise = Number(body?.amountPaise);
	if (!Number.isFinite(amountPaise) || amountPaise < 100) {
		return { status: 400, body: { error: "amountPaise must be a number ≥ 100 (₹1.00 in paise)" } };
	}

	try {
		const order = await razorpay.orders.create({
			amount: Math.round(amountPaise),
			currency: "INR",
			receipt: `poc_${Date.now()}`,
		});

		return {
			status: 200,
			body: {
				orderId: order.id,
				amount: order.amount,
				currency: order.currency,
				keyId: key_id,
			},
		};
	} catch (err) {
		console.error(err);
		const description =
			err?.error?.description || err?.error?.message || err?.message || "Failed to create order";
		const isAuth =
			err?.statusCode === 401 ||
			String(description).toLowerCase().includes("authentication");

		if (isAuth) {
			return {
				status: 401,
				body: {
					error: description,
					hint:
						"Use a matching Key ID + Key Secret from the same Razorpay account (Dashboard → API Keys). Turn Test mode on and copy both again; if you regenerated the secret, paste the new one. Avoid quotes around values in .env.",
				},
			};
		}

		return { status: 502, body: { error: description } };
	}
}

/** POST /create-checkout-session — Stripe Embedded Checkout, returns client_secret for EmbeddedCheckoutProvider */
export async function createStripeCheckoutSession(body, origin) {
	if (!stripe) {
		return {
			status: 503,
			body: {
				error:
					"Missing STRIPE_SECRET_KEY. Add it to .env (test key from Stripe Dashboard → Developers → API keys).",
			},
		};
	}

	/** Stripe amounts are in the smallest currency unit (USD → cents). Min charge is usually $0.50. */
	let unitAmount = 2000;
	if (body?.amountCents != null) {
		const c = Number(body.amountCents);
		if (Number.isFinite(c) && c >= 50) {
			unitAmount = Math.round(c);
		}
	} else if (body?.amount != null) {
		const dollars = Number(body.amount);
		if (Number.isFinite(dollars) && dollars > 0) {
			unitAmount = Math.round(dollars * 100);
		}
	}
	if (unitAmount < 50) {
		return { status: 400, body: { error: "Amount too small: use at least 0.50 USD (50 cents)" } };
	}

	try {
		const session = await stripe.checkout.sessions.create({
			ui_mode: "embedded",
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: { name: "Embedded Checkout POC" },
						unit_amount: unitAmount,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			return_url: `${origin || "http://localhost:5173"}/return?session_id={CHECKOUT_SESSION_ID}`,
		});

		if (!session.client_secret) {
			return { status: 500, body: { error: "Checkout Session missing client_secret" } };
		}

		return { status: 200, body: { clientSecret: session.client_secret } };
	} catch (err) {
		console.error(err);
		return { status: 502, body: { error: err?.message || "Failed to create Checkout Session" } };
	}
}

/** GET /session-status?session_id= — Stripe session status for the return page */
export async function getStripeSessionStatus(sessionId) {
	if (!stripe) {
		return { status: 503, body: { error: "Missing STRIPE_SECRET_KEY" } };
	}

	if (!sessionId || typeof sessionId !== "string") {
		return { status: 400, body: { error: "session_id required" } };
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		return {
			status: 200,
			body: {
				status: session.status,
				customer_email: session.customer_details?.email ?? null,
			},
		};
	} catch (err) {
		console.error(err);
		return { status: 502, body: { error: err?.message || "Failed to retrieve session" } };
	}
}
