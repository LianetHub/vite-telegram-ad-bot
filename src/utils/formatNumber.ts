export function formatNumber(value: number, decimals: number = 1): string {
	if (value < 1000) return value.toString();

	const suffixes = ["", "K", "M", "B", "T"];
	const index = Math.floor(Math.log10(value) / 3);

	const shortValue = value / Math.pow(1000, index);
	const formattedValue = shortValue.toFixed(decimals).replace(/\.0+$/, "");

	return `${formattedValue}${suffixes[index]}`;
}
