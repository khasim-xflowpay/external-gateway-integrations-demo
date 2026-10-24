import { getStripeSessionStatus } from "../server/gateways.js";

export default async function handler(req, res) {
	const { status, body } = await getStripeSessionStatus(req.query.session_id);
	res.status(status).json(body);
}
