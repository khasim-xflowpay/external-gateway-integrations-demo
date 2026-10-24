import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StripeReturn } from "./Stripe";
import { RazorpayCheckoutPage } from "./pages/RazorpayCheckoutPage";
import { StripeCheckoutPage } from "./pages/StripeCheckoutPage";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Navigate to="/razorpay-checkout" replace />} />
			<Route path="/razorpay-checkout" element={<RazorpayCheckoutPage />} />
			<Route path="/stripe-checkout" element={<StripeCheckoutPage />} />
			<Route path="/return" element={<StripeReturn />} />
		</Routes>
	</BrowserRouter>
);

export default App;
