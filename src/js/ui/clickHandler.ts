import { EventEmitter } from "../store/EventEmitter";
import { toggleSubMenu, toggleCategories, resetCategories, createRippleEffect, openModal, closeModal } from "../utils/uiActions";
// import store from "../store/store";

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

		// menu actions
		const addButton = target.closest(".header__add") as HTMLElement | null;
		if (addButton) {
			toggleSubMenu(addButton);
			this.eventEmitter.emit("subMenuToggled", addButton);
		}

		const categoriesBtn = target.closest(".header__categories-btn") as HTMLElement | null;
		if (categoriesBtn) {
			toggleCategories(categoriesBtn, this.body);
			this.eventEmitter.emit("categoriesToggled", categoriesBtn);
		}

		const categoriesResetBtn = target.closest(".header__categories-reset") as HTMLElement | null;
		if (categoriesResetBtn) {
			resetCategories();
			this.eventEmitter.emit("categoriesReset");
		}

		// Ripple-эффект
		const button = target.closest(".btn") as HTMLElement | null;
		if (button) {
			createRippleEffect(button, e);
			this.eventEmitter.emit("rippleEffect", button);
		}

		// add to cart
		const cartBtn = target.closest(".card__btn") as HTMLElement | null;
		if (cartBtn) {
			cartBtn.classList.toggle("active");
			this.eventEmitter.emit("cartToggled", cartBtn);
			console.log(cartBtn.closest(".card")?.id);

			// store.toggleCardInCart(this.data.id);
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
