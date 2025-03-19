export function formatDate(timestamp: number, locale: string = "ru-RU"): string {
	if (!timestamp) return "";

	const date = new Date(timestamp * 1000);
	let formattedDate = date.toLocaleDateString(locale, {
		day: "2-digit",
		month: "short",
	});

	return formattedDate.replace(/\.$/, "");
}
