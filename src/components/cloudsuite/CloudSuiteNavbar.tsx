import { NavLink } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
	[
		"text-sm font-medium transition-colors",
		isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800",
	].join(" ");

const checkoutNavClass = ({ isActive }: { isActive: boolean }) =>
	[
		"rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
		isActive
			? "bg-slate-900 text-white"
			: "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
	].join(" ");

export const CloudSuiteNavbar = () => (
	<header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
		<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
			<div className="flex min-w-0 flex-1 items-center gap-10">
				<NavLink to="/" className="flex shrink-0 items-center gap-2">
					<span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#2d3748] text-sm font-bold text-white">
						C
					</span>
					<span className="text-lg font-semibold tracking-tight text-slate-900">
						CloudSuite
					</span>
				</NavLink>
				<nav className="hidden items-center gap-8 md:flex">
					<a
						href="#product"
						className="text-sm font-medium text-slate-500 hover:text-slate-800"
					>
						Product
					</a>
					<a
						href="#pricing"
						className="text-sm font-medium text-slate-500 hover:text-slate-800"
					>
						Pricing
					</a>
					<a
						href="#enterprise"
						className="text-sm font-medium text-slate-500 hover:text-slate-800"
					>
						Enterprise
					</a>
					<a
						href="#docs"
						className="text-sm font-medium text-slate-500 hover:text-slate-800"
					>
						Docs
					</a>
				</nav>
			</div>

			<div className="flex items-center gap-2 sm:gap-3">
				<div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 sm:flex">
					<NavLink to="/razorpay-checkout" className={checkoutNavClass} end>
						Razorpay
					</NavLink>
					<NavLink to="/stripe-checkout" className={checkoutNavClass}>
						Stripe
					</NavLink>
				</div>
				<button
					type="button"
					className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:inline"
				>
					Sign in
				</button>
				<button
					type="button"
					className="rounded-lg bg-[#2d3748] px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
				>
					Get started
				</button>
			</div>
		</div>
		<div className="flex justify-center gap-2 border-t border-slate-100 px-4 py-2 sm:hidden">
			<NavLink to="/razorpay-checkout" className={navClass}>
				Razorpay
			</NavLink>
			<NavLink to="/stripe-checkout" className={navClass}>
				Stripe
			</NavLink>
		</div>
	</header>
);
