export function addThousandSeparator(number: number, shortenToMillion: boolean = false): string {
	let formattedNumber: string;

	if (shortenToMillion && number >= 1000000) {
		const million = (number / 1000000).toFixed(1);
		const formattedMillion = parseFloat(million) % 1 === 0 ? parseInt(million, 10).toString() : million;
		formattedNumber = `${formattedMillion} млн`;
	} else {
		formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
	}

	return formattedNumber;
}
