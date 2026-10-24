const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export function loadRazorpayCheckoutScript(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (window.Razorpay) {
			resolve();
			return;
		}
		const existing = document.querySelector<HTMLScriptElement>(
			`script[src="${CHECKOUT_SCRIPT}"]`,
		);
		if (existing) {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", () =>
				reject(new Error("Failed to load Razorpay Checkout")),
			);
			return;
		}
		const script = document.createElement("script");
		script.src = CHECKOUT_SCRIPT;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load Razorpay Checkout"));
		document.body.appendChild(script);
	});
}
