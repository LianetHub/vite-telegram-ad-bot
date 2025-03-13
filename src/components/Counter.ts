export class Counter {
	private quantityElement: HTMLElement;
	private checkboxElements: NodeListOf<HTMLInputElement>;
	private callback: (count: number) => void;

	constructor(quantitySelector: string, checkboxSelector: string, callback: (count: number) => void) {
		this.quantityElement = document.querySelector(quantitySelector) as HTMLElement;
		this.checkboxElements = document.querySelectorAll(checkboxSelector) as NodeListOf<HTMLInputElement>;
		this.callback = callback;

		this.init();
	}

	private init() {
		this.updateQuantity();

		this.checkboxElements.forEach((checkbox) => {
			checkbox.addEventListener("change", () => this.updateQuantity());
		});
	}

	private updateQuantity() {
		const checkedCount = Array.from(this.checkboxElements).filter((checkbox) => checkbox.checked).length;
		this.quantityElement.textContent = checkedCount.toString();

		if (this.callback) {
			this.callback(checkedCount);
		}
	}
}
