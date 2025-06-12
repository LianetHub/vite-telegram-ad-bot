export class Dropdown {
	private dropdown: HTMLElement;
	private button: HTMLButtonElement;
	private list: HTMLElement;
	private items: NodeListOf<HTMLLIElement>;
	private selectedText: HTMLElement;
	private input: HTMLInputElement;
	private isInitializing: boolean = true;

	constructor(dropdown: HTMLElement) {
		this.dropdown = dropdown;
		this.button = this.dropdown.querySelector(".dropdown__button") as HTMLButtonElement;
		this.list = this.dropdown.querySelector(".dropdown__list") as HTMLElement;
		this.items = this.dropdown.querySelectorAll(".dropdown__item");
		this.selectedText = this.dropdown.querySelector(".dropdown__selected") as HTMLElement;
		this.input = this.dropdown.querySelector(".dropdown__input") as HTMLInputElement;

		this.init();
		this.observeInputValueChange();
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
		this.setSelected(target.dataset.value || "", target.textContent || "");
	}

	private closeOnOutsideClick(event: Event) {
		if (!this.dropdown.contains(event.target as Node)) {
			this.list.classList.remove("open");
		}
	}

	private setSelected(value: string, text: string) {
		this.items.forEach((item) => {
			if (item.dataset.value === value) {
				item.setAttribute("aria-selected", "true");
			} else {
				item.removeAttribute("aria-selected");
			}
		});
		this.selectedText.textContent = text;
		this.input.value = value;

		if (!this.isInitializing) {
			this.input.dispatchEvent(new Event("change", { bubbles: true }));
		}
		setTimeout(() => {
			this.list.classList.remove("open");
		}, 200);
	}

	private updateDropdownFromInput() {
		const value = this.input.value;
		const matchedItem = Array.from(this.items).find((item) => item.dataset.value === value);

		if (matchedItem) {
			this.setSelected(value, matchedItem.textContent || "");
		} else {
			this.items.forEach((item) => item.removeAttribute("aria-selected"));
			this.selectedText.textContent = "";
		}
	}

	private observeInputValueChange() {
		const input = this.input;
		const self = this;
		let currentValue = input.value;

		const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
		if (!descriptor) return;

		Object.defineProperty(input, "value", {
			get() {
				return descriptor.get!.call(this);
			},
			set(value: string) {
				descriptor.set!.call(this, value);
				if (value !== currentValue) {
					currentValue = value;
					self.updateDropdownFromInput();
				}
			},
			configurable: true,
			enumerable: true,
		});

		this.isInitializing = true;
		this.updateDropdownFromInput();
		this.isInitializing = false;
	}
}
