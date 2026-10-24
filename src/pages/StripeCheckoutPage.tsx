import { useState } from "react";
import { CloudSuiteCheckoutLayout } from "../components/cloudsuite/CloudSuiteCheckoutLayout";
import { CloudSuitePricingCard } from "../components/cloudsuite/CloudSuitePricingCard";
import { StripeCheckoutEmbed } from "../components/stripe/StripeCheckoutEmbed";

export const StripeCheckoutPage = () => {
	const [billing, setBilling] = useState<"monthly" | "lifetime">("lifetime");

	return (
		<CloudSuiteCheckoutLayout>
			<CloudSuitePricingCard
				billing={billing}
				onBillingChange={setBilling}
				securedBy="Stripe"
				showPayButton={false}
			>
				<StripeCheckoutEmbed />
			</CloudSuitePricingCard>
		</CloudSuiteCheckoutLayout>
	);
};
