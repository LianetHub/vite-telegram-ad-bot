import { EventEmitter } from "../store/EventEmitter";
import { toggleSubMenu, toggleCategories, hideCategories, resetCategories, createRippleEffect, openModal, closeModal } from "../utils/uiActions";
import { store } from "../store/store";

export class ClickHandler {
	private body: HTMLElement;

	constructor(private eventEmitter: EventEmitter) {
		this.body = document.body;
		this.init();
	}

	private init() {
		document.addEventListener("click", this.handleClick.bind(this));
	}

	private handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement | null;
		if (!target) return;

		console.log(target);

		// menu actions
		const addButton = target.closest(".header__add") as HTMLElement | null;
		if (addButton) {
			toggleSubMenu(addButton);
			this.eventEmitter.emit("subMenuToggled", addButton);
		}

		const categoriesBtn = target.closest(".header__categories-btn") as HTMLElement | null;
		if (categoriesBtn) {
			toggleCategories();
		}

		const categoriesHideBtn = target.closest(".header__categories-close") as HTMLElement | null;
		if (categoriesHideBtn) {
			hideCategories();
		}

		const categoriesResetBtn = target.closest(".header__categories-reset") as HTMLElement | null;
		if (categoriesResetBtn) {
			resetCategories();
			this.eventEmitter.emit("categoriesReset");
		}

		const searchBtn = target.closest(".header__search-btn") as HTMLElement | null;
		if (searchBtn) {
			document.querySelector(".header__bottom")?.classList.add("open-search");
			setTimeout(() => {
				const searchInput = document.querySelector(".header__search .form__control") as HTMLInputElement;
				searchInput?.focus();
			}, 300);
		}

		const searchBack = target.closest(".header__search-back") as HTMLElement | null;
		if (searchBack) {
			document.querySelector(".header__bottom")?.classList.remove("open-search");
		}

		// Ripple-эффект
		const button = (target.closest(".btn") || target.closest(".radio-btn__field")) as HTMLElement | null;
		if (button) {
			createRippleEffect(button, e);
			this.eventEmitter.emit("rippleEffect", button);
		}

		// add to cart
		const cartBtn = target.closest(".card__btn") as HTMLElement | null;
		if (cartBtn) {
			cartBtn.classList.toggle("active");
			const card = cartBtn.closest(".card") as HTMLElement;

			store.toggleToCart(card.id);
		}

		// Open modal
		const modalLink = target.closest("[data-modal]") as HTMLElement | null;
		if (modalLink) {
			openModal(modalLink);
			this.eventEmitter.emit("modalOpened", modalLink);
		}

		// Close modal
		const closeModalButton = target.closest("[data-modal-close]") as HTMLElement | null;
		if (closeModalButton) {
			closeModal();
			this.eventEmitter.emit("modalClosed", closeModalButton);
		}

		const modal = target.closest(".modal") as HTMLElement | null;
		if (modal && !target.closest(".modal__wrapper")) {
			closeModal();
			this.eventEmitter.emit("modalClosed", modal);
		}
	}
}
