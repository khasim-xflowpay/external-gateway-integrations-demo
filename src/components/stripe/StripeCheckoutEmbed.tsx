import { useCallback, useState } from "react";
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe-client";

export const StripeCheckoutEmbed = () => {
	const [amountDollars, setAmountDollars] = useState(20);
	const [amountInput, setAmountInput] = useState("20");

	const fetchClientSecret = useCallback(() => {
		return fetch("/create-checkout-session", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ amount: amountDollars }),
		})
			.then((res) => {
				if (!res.ok) {
					return res.json().then((body) => {
						throw new Error(body?.error || `HTTP ${res.status}`);
					});
				}
				return res.json();
			})
			.then((data: { clientSecret?: string }) => {
				if (!data.clientSecret) {
					throw new Error("Missing clientSecret from server");
				}
				return data.clientSecret;
			});
	}, [amountDollars]);

	if (!stripePromise) {
		return (
			<p className="text-sm text-slate-600 leading-relaxed">
				Set{" "}
				<code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
					VITE_STRIPE_PUBLISHABLE_KEY
				</code>{" "}
				in <code className="rounded bg-slate-100 px-1 py-0.5">.env</code>{" "}
				(pk_test_…).
			</p>
		);
	}

	const options = { fetchClientSecret };

	return (
		<div className="space-y-4">
			<p className="text-xs text-slate-500">
				Embedded Checkout bills in{" "}
				<span className="font-medium text-slate-700">USD</span> (demo server).
				Adjust amount and the form reloads.
			</p>
			<div className="flex flex-wrap items-center gap-2 text-sm">
				<label htmlFor="stripe-amount" className="text-slate-600">
					Amount (USD)
				</label>
				<input
					id="stripe-amount"
					type="number"
					min={0.5}
					step={0.01}
					value={amountInput}
					onChange={(e) => setAmountInput(e.target.value)}
					className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
				/>
				<button
					type="button"
					className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
					onClick={() => {
						const n = parseFloat(amountInput);
						if (Number.isFinite(n) && n >= 0.5) {
							setAmountDollars(n);
						}
					}}
				>
					Apply
				</button>
			</div>
			<div
				id="checkout"
				className="min-h-[420px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
			>
				<EmbeddedCheckoutProvider
					stripe={stripePromise}
					options={options}
					key={amountDollars}
				>
					<EmbeddedCheckout />
				</EmbeddedCheckoutProvider>
			</div>
		</div>
	);
};
