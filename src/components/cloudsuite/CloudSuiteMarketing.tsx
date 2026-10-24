const features = [
	"Unlimited workspaces",
	"Advanced automation",
	"Priority support",
	"SSO/SAML",
	"Custom domain",
	"99.99% uptime",
];

export const CloudSuiteMarketing = () => (
	<div className="space-y-8">
		<div>
			<h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
				CloudSuite Business Plan
			</h1>
			<p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
				Everything your team needs to ship faster — automation, governance, and
				enterprise-grade reliability in one place. Upgrade once, scale forever.
			</p>
		</div>

		<ul className="space-y-3">
			{features.map((label) => (
				<li key={label} className="flex items-start gap-3">
					<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
						<svg
							className="h-3 w-3 text-emerald-700"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2.5}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</span>
					<span className="text-[15px] text-slate-700">{label}</span>
				</li>
			))}
		</ul>

		<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="flex items-center gap-3">
				<div className="flex -space-x-2">
					{["bg-violet-500", "bg-amber-500", "bg-sky-500", "bg-rose-500"].map(
						(bg, i) => (
							<span
								key={i}
								className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white ${bg}`}
							>
								{["A", "B", "C", "D"][i]}
							</span>
						),
					)}
				</div>
				<p className="text-sm text-slate-600">
					<span className="font-medium text-slate-800">4,200+ teams in India</span>{" "}
					trust CloudSuite ·{" "}
					<span className="inline-flex items-center gap-0.5 text-amber-500">
						★
					</span>{" "}
					4.9/5 (2.1k reviews)
				</p>
			</div>
		</div>
	</div>
);
