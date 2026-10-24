import "dotenv/config";
import cors from "cors";
import express from "express";
// Node server SDK (Orders API, etc.) — not the browser Checkout script (checkout.razorpay.com/v1/checkout.js).
import Razorpay from "razorpay";
import Stripe from "stripe";

const PORT = Number(process.env.PORT) || 8787;

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
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/api/create-order", async (req, res) => {
	if (!razorpay || !key_id) {
		return res.status(503).json({
			error:
				"Missing Razorpay keys. Copy .env.example to .env and set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (test mode from Dashboard).",
		});
	}

	const amountPaise = Number(req.body?.amountPaise);
	if (!Number.isFinite(amountPaise) || amountPaise < 100) {
		return res.status(400).json({ error: "amountPaise must be a number ≥ 100 (₹1.00 in paise)" });
	}

	try {
		const order = await razorpay.orders.create({
			amount: Math.round(amountPaise),
			currency: "INR",
			receipt: `poc_${Date.now()}`,
		});

		return res.json({
			orderId: order.id,
			amount: order.amount,
			currency: order.currency,
			keyId: key_id,
		});
	} catch (err) {
		console.error(err);
		const description =
			err?.error?.description || err?.error?.message || err?.message || "Failed to create order";
		const isAuth =
			err?.statusCode === 401 ||
			String(description).toLowerCase().includes("authentication");

		if (isAuth) {
			return res.status(401).json({
				error: description,
				hint:
					"Use a matching Key ID + Key Secret from the same Razorpay account (Dashboard → API Keys). Turn Test mode on and copy both again; if you regenerated the secret, paste the new one. Avoid quotes around values in .env.",
			});
		}

		return res.status(502).json({ error: description });
	}
});

/** Stripe Embedded Checkout — returns client_secret for EmbeddedCheckoutProvider */
app.post("/create-checkout-session", async (req, res) => {
	if (!stripe) {
		return res.status(503).json({
			error:
				"Missing STRIPE_SECRET_KEY. Add it to .env (test key from Stripe Dashboard → Developers → API keys).",
		});
	}

	const origin = req.headers.origin || "http://localhost:5173";

	/** Stripe amounts are in the smallest currency unit (USD → cents). Min charge is usually $0.50. */
	let unitAmount = 2000;
	if (req.body?.amountCents != null) {
		const c = Number(req.body.amountCents);
		if (Number.isFinite(c) && c >= 50) {
			unitAmount = Math.round(c);
		}
	} else if (req.body?.amount != null) {
		const dollars = Number(req.body.amount);
		if (Number.isFinite(dollars) && dollars > 0) {
			unitAmount = Math.round(dollars * 100);
		}
	}
	if (unitAmount < 50) {
		return res.status(400).json({
			error: "Amount too small: use at least 0.50 USD (50 cents)",
		});
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
			return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
		});

		if (!session.client_secret) {
			return res.status(500).json({ error: "Checkout Session missing client_secret" });
		}

		return res.json({ clientSecret: session.client_secret });
	} catch (err) {
		console.error(err);
		return res.status(502).json({
			error: err?.message || "Failed to create Checkout Session",
		});
	}
});

app.get("/session-status", async (req, res) => {
	if (!stripe) {
		return res.status(503).json({ error: "Missing STRIPE_SECRET_KEY" });
	}

	const sessionId = req.query.session_id;
	if (!sessionId || typeof sessionId !== "string") {
		return res.status(400).json({ error: "session_id required" });
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		return res.json({
			status: session.status,
			customer_email: session.customer_details?.email ?? null,
		});
	} catch (err) {
		console.error(err);
		return res.status(502).json({ error: err?.message || "Failed to retrieve session" });
	}
});

app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT} (Razorpay + Stripe)`);
});
