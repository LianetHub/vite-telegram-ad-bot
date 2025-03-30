import { EventEmitter } from "../../store/EventEmitter";
import {
	toggleSubMenu,
	toggleCategories,
	hideCategories,
	categoriesUIUpdate,
	createRippleEffect,
	openModal,
	closeModal,
	languageUIUpdate,
	toggleResetSearchBtn,
} from "../../utils/uiActions";

import { store } from "../../store/store";

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

		// menu actions
		const addButton = target.closest(".header__add") as HTMLElement | null;
		if (addButton) {
			toggleSubMenu(addButton);
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
			this.eventEmitter.emit("filters:categories-reset");
			categoriesResetBtn.classList.add("loading");
		}

		const languagesResetBtn = target.closest("[data-reset-languages]") as HTMLElement | null;
		if (languagesResetBtn) {
			this.eventEmitter.emit("filters:languages-reset");
			languageUIUpdate(0);
		}

		const allFiltersResetBtn = target.closest("[data-clear-all-filters]") as HTMLElement | null;
		if (allFiltersResetBtn) {
			this.eventEmitter.emit("filters:reset-all");
			categoriesUIUpdate(0);
			languageUIUpdate(0);
		}

		// clear cart
		const resetFilterBtn = target.closest("[data-reset-filter]") as HTMLElement | null;
		if (resetFilterBtn) {
			resetFilterBtn.classList.add("loading");
			this.eventEmitter.emit("filters:reset");
		}

		// ========== Search Logic =============
		const searchBtn = target.closest(".header__search-btn") as HTMLElement | null;
		const searchBottom = document.querySelector(".header__bottom") as HTMLElement | null;
		const searchInput = document.querySelector(".header__search .form__control") as HTMLInputElement;
		if (searchBtn) {
			searchBottom?.classList.add("open-search");
			searchInput?.focus();
		}

		const searchBack = target.closest(".header__search-back") as HTMLElement | null;
		if (searchBack) {
			searchBottom?.classList.remove("open-search");
			const currentValue = searchInput.value;
			if (currentValue.length > 0) {
				searchInput.value = "";
				toggleResetSearchBtn(searchInput.value);
				this.eventEmitter.emit("filters:search-reset");
			}
		}

		const resetSearchBtn = target.closest(".header__search-reset") as HTMLElement | null;
		if (resetSearchBtn) {
			searchInput.value = "";
			toggleResetSearchBtn(searchInput.value);
			this.eventEmitter.emit("filters:search-reset");
		}
		// ========== Search Logic =============

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
		// remove from cart
		const cartRemoveBtn = target.closest(".card__remove") as HTMLButtonElement | null;
		if (cartRemoveBtn) {
			const card = cartRemoveBtn.closest(".card") as HTMLElement;
			store.removeFromCart(card.id);
			card.remove();
		}

		// clear cart
		const clearCartBtn = target.closest("[data-clear-cart]") as HTMLElement | null;
		if (clearCartBtn) {
			store.clearCart();
			clearCartBtn.classList.add("hidden");
		}

		// ================= Modal Logic ==============
		const modalLink = target.closest("[data-modal]") as HTMLElement | null;
		if (modalLink) {
			openModal(modalLink);
			this.eventEmitter.emit("modal:opened", modalLink);
		}

		const closeModalButton = target.closest("[data-modal-close]") as HTMLElement | null;
		if (closeModalButton) {
			closeModal();
			this.eventEmitter.emit("modal:closed", closeModalButton);
		}

		const modal = target.closest(".modal") as HTMLElement | null;
		if (modal && !target.closest(".modal__wrapper")) {
			closeModal();
			this.eventEmitter.emit("modal:closed", modal);
		}
		// ================= Modal Logic ==============

		// ================= Card Logic ===============

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

		// ================= Card Logic ===============
	}
}
