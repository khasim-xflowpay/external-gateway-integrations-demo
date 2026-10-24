import { useCallback, useState } from "react";
import { CloudSuiteCheckoutLayout } from "../components/cloudsuite/CloudSuiteCheckoutLayout";
import { CloudSuitePricingCard } from "../components/cloudsuite/CloudSuitePricingCard";
import {
	TOTAL_MONTHLY_PAISE,
	TOTAL_PAISE,
} from "../components/cloudsuite/constants";
import { loadRazorpayCheckoutScript } from "../lib/razorpay-script";
import type { RazorpaySuccessResponse } from "../razorpay-checkout";

export const RazorpayCheckoutPage = () => {
	const [billing, setBilling] = useState<"monthly" | "lifetime">("lifetime");
	const [busy, setBusy] = useState(false);
	const [log, setLog] = useState<string | null>(null);

	const pay = useCallback(async () => {
		setLog(null);
		setBusy(true);
		try {
			await loadRazorpayCheckoutScript();
			const amountPaise =
				billing === "lifetime" ? TOTAL_PAISE : TOTAL_MONTHLY_PAISE;

			const r = await fetch("/api/create-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ amountPaise }),
			});
			const data = (await r.json()) as {
				orderId?: string;
				amount?: number;
				currency?: string;
				keyId?: string;
				error?: string;
				hint?: string;
			};

			if (!r.ok) {
				const msg = [data.error, data.hint].filter(Boolean).join("\n\n");
				setLog(msg || `Order failed (${r.status})`);
				return;
			}

			const { orderId, amount, currency, keyId } = data;
			if (!orderId || !keyId || amount == null || !currency) {
				setLog("Invalid response from order API");
				return;
			}

			const onSuccess = (response: RazorpaySuccessResponse) => {
				setLog(
					`Payment initiated. In production, verify signature on your server.\n` +
						`payment_id: ${response.razorpay_payment_id}\n` +
						`order_id: ${response.razorpay_order_id}`,
				);
			};

			const rz = new window.Razorpay({
				key: keyId,
				amount,
				currency,
				order_id: orderId,
				name: "CloudSuite",
				description: "Business Plan",
				handler: onSuccess,
				prefill: {
					name: "Test User",
					email: "test@example.com",
					contact: "9999999999",
				},
				theme: { color: "#1e293b" },
				modal: {
					ondismiss: () => setLog("Checkout closed without paying."),
				},
			});
			rz.open();
		} catch (e) {
			setLog(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}, [billing]);

	return (
		<CloudSuiteCheckoutLayout>
			<CloudSuitePricingCard
				billing={billing}
				onBillingChange={setBilling}
				securedBy="Razorpay"
				busy={busy}
				onPayClick={pay}
				showPayButton
			>
				{log && (
					<pre className="max-h-48 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 whitespace-pre-wrap wrap-break-word">
						{log}
					</pre>
				)}
			</CloudSuitePricingCard>
		</CloudSuiteCheckoutLayout>
	);
};
