import { createStripeCheckoutSession } from "../server/gateways.js";

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
	const origin = req.headers.origin || `https://${req.headers.host}`;
	const { status, body } = await createStripeCheckoutSession(req.body, origin);
	res.status(status).json(body);
}
