import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

function initialReturnStatus(): string | null {
	const sessionId = new URLSearchParams(window.location.search).get(
		"session_id",
	);
	return sessionId ? null : "missing_session";
}

export const StripeReturn = () => {
	const [status, setStatus] = useState<string | null>(initialReturnStatus);
	const [customerEmail, setCustomerEmail] = useState<string>("");

	useEffect(() => {
		const sessionId = new URLSearchParams(window.location.search).get(
			"session_id",
		);
		if (!sessionId) return;

		fetch(`/session-status?session_id=${encodeURIComponent(sessionId)}`)
			.then(async (res) => {
				const data = (await res.json()) as {
					status?: string;
					customer_email?: string | null;
					error?: string;
				};
				if (!res.ok) {
					throw new Error(data.error || `HTTP ${res.status}`);
				}
				return data;
			})
			.then((data) => {
				setStatus(data.status ?? "unknown");
				setCustomerEmail(data.customer_email ?? "");
			})
			.catch(() => setStatus("error"));
	}, []);

	if (status === "open") {
		return <Navigate to="/stripe-checkout" replace />;
	}

	if (status === "complete") {
		return (
			<section
				id="success"
				className="min-h-screen bg-[#f7fafc] text-slate-900 p-6 flex flex-col items-center justify-center"
			>
				<p className="max-w-md text-center text-slate-700">
					We appreciate your business! A confirmation email will be sent to{" "}
					{customerEmail || "your address"}. If you have any questions, please
					email <a className="text-slate-900 underline" href="mailto:orders@example.com">orders@example.com</a>.
				</p>
				<Link
					to="/razorpay-checkout"
					className="mt-6 text-sm font-medium text-slate-700 hover:underline"
				>
					← Back to CloudSuite
				</Link>
			</section>
		);
	}

	if (status === "missing_session" || status === "error") {
		return (
			<div className="min-h-screen bg-[#f7fafc] text-slate-900 p-6">
				<p>Could not load session status.</p>
				<Link
					to="/stripe-checkout"
					className="text-sm font-medium text-slate-700 mt-4 inline-block hover:underline"
				>
					Back to checkout
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f7fafc] text-slate-900 p-6 flex items-center justify-center">
			<p className="text-slate-500">Loading…</p>
		</div>
	);
};
