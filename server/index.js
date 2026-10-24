// Local API server for `yarn dev`. On Vercel the same handlers run as functions in api/.
import "dotenv/config";
import cors from "cors";
import express from "express";

// Imported after dotenv has loaded .env, because gateways.js reads the keys on load
const { createRazorpayOrder, createStripeCheckoutSession, getStripeSessionStatus } = await import(
	"./gateways.js"
);

const PORT = Number(process.env.PORT) || 8787;

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const send = (res, { status, body }) => res.status(status).json(body);

app.post("/api/create-order", async (req, res) => send(res, await createRazorpayOrder(req.body)));

app.post("/create-checkout-session", async (req, res) =>
	send(res, await createStripeCheckoutSession(req.body, req.headers.origin)),
);

app.get("/session-status", async (req, res) =>
	send(res, await getStripeSessionStatus(req.query.session_id)),
);

app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT} (Razorpay + Stripe)`);
});
