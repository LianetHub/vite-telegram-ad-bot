export function addLoading(button: HTMLButtonElement | null): void {
	if (!button || button.classList.contains("loading")) return;

	button.classList.add("loading");

	const spinner = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	spinner.setAttribute("class", "spinner");
	spinner.setAttribute("viewBox", "0 0 50 50");

	const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("class", "path");
	circle.setAttribute("cx", "25");
	circle.setAttribute("cy", "25");
	circle.setAttribute("r", "20");
	circle.setAttribute("fill", "none");
	circle.setAttribute("stroke-width", "5");

	spinner.appendChild(circle);
	button.appendChild(spinner);
}

export function removeLoading(button: HTMLButtonElement | null): void {
	if (!button) return;

	button.classList.remove("loading");

	const spinner = button.querySelector("svg.spinner");
	if (spinner) {
		button.removeChild(spinner);
	}
}
