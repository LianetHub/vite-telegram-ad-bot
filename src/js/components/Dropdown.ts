export class Dropdown {
	private dropdown: HTMLElement;
	private button: HTMLButtonElement;
	private list: HTMLElement;
	private items: NodeListOf<HTMLLIElement>;
	private selectedText: HTMLElement;
	private input: HTMLInputElement;

	constructor(dropdown: HTMLElement) {
		this.dropdown = dropdown;
		this.button = this.dropdown.querySelector(".dropdown__button") as HTMLButtonElement;
		this.list = this.dropdown.querySelector(".dropdown__list") as HTMLElement;
		this.items = this.dropdown.querySelectorAll(".dropdown__item");
		this.selectedText = this.dropdown.querySelector(".dropdown__selected") as HTMLElement;
		this.input = this.dropdown.querySelector(".dropdown__input") as HTMLInputElement;

		this.init();
	}

	private init() {
		this.button.addEventListener("click", () => this.toggle());
		this.items.forEach((item) => item.addEventListener("click", (event) => this.select(event)));
		document.addEventListener("click", (event) => this.closeOnOutsideClick(event));
	}

	private toggle() {
		this.list.classList.toggle("open");
	}

	private select(event: Event) {
		const target = event.target as HTMLLIElement;
		this.items.forEach((item) => item.removeAttribute("aria-selected"));
		target.setAttribute("aria-selected", "true");
		this.selectedText.textContent = target.textContent || "";
		this.input.value = target.dataset.value || "";
		this.input.dispatchEvent(new Event("change", { bubbles: true }));
		this.list.classList.remove("open");
	}

	private closeOnOutsideClick(event: Event) {
		if (!this.dropdown.contains(event.target as Node)) {
			this.list.classList.remove("open");
		}
	}
}
