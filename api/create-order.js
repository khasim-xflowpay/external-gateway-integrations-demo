import { createRazorpayOrder } from "../server/gateways.js";

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
	const { status, body } = await createRazorpayOrder(req.body);
	res.status(status).json(body);
}
