export function addThousandSeparator(number: number) {
	let numberString = number.toString();

	return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
}
