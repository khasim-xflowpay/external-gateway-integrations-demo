import type { ReactNode } from "react";
import { formatInr, GST_INR, PLAN_LABEL, BASE_INR, TOTAL_INR } from "./constants";

type Billing = "monthly" | "lifetime";

type Props = {
	billing: Billing;
	onBillingChange: (b: Billing) => void;
	/** Primary action area: Pay button or embedded checkout */
	children: ReactNode;
	/** Shown under the CTA area */
	securedBy: "Razorpay" | "Stripe";
	busy?: boolean;
	onPayClick?: () => void;
	/** If false, hides the Pay Securely button (e.g. Stripe embed) */
	showPayButton?: boolean;
};

export const CloudSuitePricingCard = ({
	billing,
	onBillingChange,
	children,
	securedBy,
	busy = false,
	onPayClick,
	showPayButton = true,
}: Props) => {
	const isLifetime = billing === "lifetime";
	const headlineAmount = isLifetime ? BASE_INR : 1499;
	const subline = isLifetime ? "pay once, use forever" : "per month, billed monthly";

	return (
		<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08),0_12px_48px_-12px_rgba(15,23,42,0.12)] sm:p-8">
			<div className="flex rounded-full border border-slate-200 bg-slate-100/80 p-1">
				<button
					type="button"
					onClick={() => onBillingChange("monthly")}
					className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
						!isLifetime
							? "bg-white text-slate-900 shadow-sm"
							: "text-slate-500 hover:text-slate-700"
					}`}
				>
					Monthly
				</button>
				<button
					type="button"
					onClick={() => onBillingChange("lifetime")}
					className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
						isLifetime
							? "bg-white text-slate-900 shadow-sm"
							: "text-slate-500 hover:text-slate-700"
					}`}
				>
					Lifetime
				</button>
			</div>

			<div className="mt-8">
				<p className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
					{formatInr(isLifetime ? BASE_INR : headlineAmount)}
				</p>
				<p className="mt-1 text-sm text-slate-500">{subline}</p>
			</div>

			<div className="mt-8 space-y-3 border-t border-slate-100 pt-6">
				<div className="flex justify-between text-sm">
					<span className="text-slate-500">
						{isLifetime ? PLAN_LABEL : "Business Plan — Monthly"}
					</span>
					<span className="font-medium tabular-nums text-slate-900">
						{formatInr(isLifetime ? BASE_INR : headlineAmount)}
					</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-slate-500">GST (18%)</span>
					<span className="font-medium tabular-nums text-slate-900">
						{formatInr(isLifetime ? GST_INR : Math.round(headlineAmount * 0.18 * 100) / 100)}
					</span>
				</div>
				<div className="border-t border-slate-200 pt-3">
					<div className="flex justify-between text-sm">
						<span className="text-slate-600">Total due today</span>
						<span className="text-lg font-bold tabular-nums text-slate-900">
							{formatInr(
								isLifetime
									? TOTAL_INR
									: Math.round(headlineAmount * 1.18 * 100) / 100,
							)}
						</span>
					</div>
				</div>
			</div>

			{showPayButton && onPayClick && (
				<button
					type="button"
					onClick={onPayClick}
					disabled={busy}
					className="mt-8 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{busy ? "Please wait…" : "Pay Securely"}
				</button>
			)}

			<div className="mt-6">{children}</div>

			<p className="mt-6 text-center text-xs text-slate-500">
				Secured by{" "}
				<span className="font-semibold text-slate-700">{securedBy}</span>
			</p>
		</div>
	);
};
