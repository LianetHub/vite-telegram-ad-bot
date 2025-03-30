export function getGridClass(blocks: number): string {
	if (blocks >= 4 && blocks <= 6) return "grid-3x2";
	if (blocks >= 7 && blocks <= 9) return "grid-3x3";
	if (blocks >= 10 && blocks <= 12) return "grid-4x3";
	if (blocks >= 13 && blocks <= 15) return "grid-5x3";
	if (blocks >= 16 && blocks <= 18) return "grid-6x3";
	if (blocks >= 19 && blocks <= 21) return "grid-7x3";
	if (blocks >= 22 && blocks <= 24) return "grid-8x3";
	if (blocks >= 25 && blocks <= 27) return "grid-9x3";
	if (blocks >= 28 && blocks <= 30) return "grid-10x3";

	return "";
}
