export function addThousandSeparator(number: number, shortenToMillion: boolean = false): string {
	let formattedNumber: string;

	if (shortenToMillion && number >= 1000000) {
		const million = (number / 1000000).toFixed(1);
		formattedNumber = `${million} млн`;
	} else {
		formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u205F");
	}

	return formattedNumber;
}
