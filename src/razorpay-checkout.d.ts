/** Success payload passed to Checkout `handler` (browser script). */
export type RazorpaySuccessResponse = {
	razorpay_payment_id: string;
	razorpay_order_id: string;
	razorpay_signature: string;
};

declare global {
	interface Window {
		/** Set by https://checkout.razorpay.com/v1/checkout.js */
		Razorpay: new (options: {
			key: string;
			amount: string | number;
			currency: string;
			order_id: string;
			name: string;
			description?: string;
			handler: (response: RazorpaySuccessResponse) => void;
			prefill?: { name?: string; email?: string; contact?: string };
			theme?: { color?: string };
			modal?: { ondismiss?: () => void };
		}) => { open: () => void };
	}
}

export {};
