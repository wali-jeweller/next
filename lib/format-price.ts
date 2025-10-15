export function formatPrice(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "PKR",
		currencyDisplay: "narrowSymbol",
		useGrouping: true,
		currencySign: "standard",
		compactDisplay: "short",
		maximumFractionDigits: 0,
	}).format(amount);
}
