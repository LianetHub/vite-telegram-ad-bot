import { EventEmitter } from "../../store/EventEmitter";

export class ClickHandler {
	constructor(private eventEmitter: EventEmitter) {
		this.init();
	}

	private init() {
		document.addEventListener("click", this.handleClick.bind(this));
	}

	private handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement | null;
		if (!target) return;

		// Ripple-effect
		const button = (target.closest(".btn") || target.closest(".radio-btn__field")) as HTMLElement | null;
		if (button) {
			this.createRippleEffect(button, e);
		}

		const addButton = target.closest(".header__add") as HTMLElement | null;
		if (addButton) {
			this.toggleSubMenu(addButton);
		}

		const categoriesBtn = target.closest(".header__categories-btn") as HTMLElement | null;
		if (categoriesBtn) {
			this.toggleCategories();
		}

		const categoriesHideBtn = target.closest(".header__categories-close") as HTMLElement | null;
		if (categoriesHideBtn) {
			this.hideCategories();
		}

		const moreCardCountriesBtn = target.closest(".card__countries-more") as HTMLButtonElement | null;
		const allCardLists = document.querySelectorAll(".card__countries-list.visible");
		const allActiveButtons = document.querySelectorAll(".card__countries-more.active");

		if (moreCardCountriesBtn) {
			const currentList = moreCardCountriesBtn.nextElementSibling as HTMLElement | null;
			const isAlreadyOpen = currentList?.classList.contains("visible");

			allCardLists.forEach((list) => list.classList.remove("visible"));
			allActiveButtons.forEach((btn) => btn.classList.remove("active"));

			if (!isAlreadyOpen) {
				moreCardCountriesBtn.classList.add("active");
				currentList?.classList.add("visible");
			}
		} else {
			allCardLists.forEach((list) => list.classList.remove("visible"));
			allActiveButtons.forEach((btn) => btn.classList.remove("active"));
		}

		const cartTimeBtn = target.closest(".card__time") as HTMLButtonElement | null;
		if (cartTimeBtn) {
			// const currentCard = cartTimeBtn.closest(".card");
			// const currentCardId = currentCard?.id;
			// this.eventEmitter.emit("filters:search-reset", currentCardId);
		}
	}

	private toggleSubMenu(addButton: HTMLElement) {
		addButton.classList.toggle("active");
		const sortElement = document.querySelector(".header__sort") as HTMLElement | null;
		sortElement?.classList.toggle("active");
	}

	private toggleCategories() {
		const wrapper = document.querySelector(".header__bottom") as HTMLElement | null;
		wrapper?.classList.toggle("open-categories");
		document.body.classList.toggle("lock");
	}

	private hideCategories() {
		const wrapper = document.querySelector(".header__bottom") as HTMLElement | null;
		wrapper?.classList.remove("open-categories");
		document.body.classList.remove("lock");
	}

	private createRippleEffect(button: HTMLElement, event: MouseEvent) {
		const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

		const ripple = document.createElement("span");
		ripple.classList.add("ripple");

		const rect = button.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		ripple.style.width = ripple.style.height = `${size}px`;

		const x = (event.clientX - rect.left - size / 2) / rootFontSize;
		const y = (event.clientY - rect.top - size / 2) / rootFontSize;
		ripple.style.left = `${x}rem`;
		ripple.style.top = `${y}rem`;

		button.appendChild(ripple);

		setTimeout(() => {
			ripple.remove();
		}, 600);
	}
}
