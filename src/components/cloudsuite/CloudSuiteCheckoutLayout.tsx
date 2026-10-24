import type { ReactNode } from "react";
import { CloudSuiteMarketing } from "./CloudSuiteMarketing";
import { CloudSuiteNavbar } from "./CloudSuiteNavbar";

export const CloudSuiteCheckoutLayout = ({
	children,
}: {
	children: ReactNode;
}) => (
	<div className="min-h-screen bg-[#f7fafc] text-slate-900">
		<CloudSuiteNavbar />
		<main
			id="product"
			className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16"
		>
			<div
				id="pricing"
				className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start"
			>
				<div id="enterprise" className="lg:pt-2">
					<CloudSuiteMarketing />
				</div>
				<div className="lg:pt-2">{children}</div>
			</div>
			<p id="docs" className="sr-only">
				Documentation links are placeholders for this POC.
			</p>
		</main>
	</div>
);
