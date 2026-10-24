/** CloudSuite Business Plan — Lifetime (INR), matches marketing + checkout card */
export const PLAN_LABEL = "Business Plan - Lifetime";
export const BASE_INR = 14999;
export const GST_RATE = 0.18;
export const GST_INR = Math.round(BASE_INR * GST_RATE * 100) / 100;
export const TOTAL_INR = BASE_INR + GST_INR;
export const TOTAL_PAISE = Math.round(TOTAL_INR * 100);

export const BASE_MONTHLY_INR = 1499;
export const TOTAL_MONTHLY_INR =
	Math.round(BASE_MONTHLY_INR * (1 + GST_RATE) * 100) / 100;
export const TOTAL_MONTHLY_PAISE = Math.round(TOTAL_MONTHLY_INR * 100);

export function formatInr(n: number) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
	}).format(n);
}
