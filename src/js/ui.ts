export class UIHandler {
	private body: HTMLElement;

	constructor() {
		document.addEventListener("click", this.handleClick.bind(this));
		document.addEventListener("change", this.handleChange.bind(this));
		this.body = document.body;

		this.init();
	}

	private init() {
		console.log("init ui");
	}

	private handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement | null;
		if (!target) return;

		// console.log(target);

		// menu actions
		const addButton = target.closest(".header__add") as HTMLElement | null;
		if (addButton) {
			this.toggleSubMenu(addButton);
		}

		const categoriesBtn = target.closest(".header__categories-btn") as HTMLElement | null;
		if (categoriesBtn) {
			this.toggleCategories(categoriesBtn);
		}

		const categoriesResetBtn = target.closest(".header__categories-reset") as HTMLElement | null;
		if (categoriesResetBtn) {
			this.resetCategories();
		}

		// Ripple-эффект
		const button = target.closest(".btn") as HTMLElement | null;
		if (button) {
			this.createRippleEffect(button, e);
		}

		// cart
		const cartBtn = target.closest(".card__btn") as HTMLElement | null;
		if (cartBtn) {
			cartBtn.classList.toggle("active");
		}

		// Открытие модального окна
		const modalLink = target.closest("[data-modal]") as HTMLElement | null;
		if (modalLink) {
			this.openModal(modalLink);
		}

		// Закрытие модального окна
		const closeModalButton = target.closest("[data-modal-close]") as HTMLElement | null;
		if (closeModalButton) {
			this.closeModal();
		}

		const modal = target.closest(".modal") as HTMLElement | null;
		if (modal && !target.closest(".modal__wrapper")) {
			this.closeModal();
		}
	}

	private handleChange(e: Event) {
		const target = e.target as HTMLInputElement;

		if (target.name === "category") {
			const categoriesQuantityElement = document.querySelector(".header__categories-quantity") as HTMLElement;
			if (categoriesQuantityElement) {
				this.updateCheckboxQuantity(categoriesQuantityElement, (count) => {
					this.categoriesUIUpdate(count);
				});
			}
		}

		if (target.name === "language") {
			const languageQuantityElement = document.querySelector(".modal__language-quantity") as HTMLElement;
			if (languageQuantityElement) {
				this.updateCheckboxQuantity(languageQuantityElement, (count) => {
					this.languageUIUpdate(count);
				});
			}
		}
	}

	private updateCheckboxQuantity(element: HTMLElement, callback?: (count: number) => void) {
		const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="' + element.getAttribute("data-name") + '"]');

		const checkedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;

		element.innerText = checkedCount.toString();

		if (callback) {
			callback(checkedCount);
		}
	}

	private toggleCategories(categoriesBtn: HTMLElement) {
		categoriesBtn.classList.toggle("active");
		const categoriesBody = document.querySelector(".header__categories-body") as HTMLElement | null;
		categoriesBody?.classList.toggle("active");
		this.body.classList.toggle("lock");
	}

	private resetCategories() {
		document.querySelectorAll<HTMLInputElement>(".header__categories-checkbox").forEach((checkbox) => {
			checkbox.checked = false;
		});
		this.updateCheckboxQuantity(document.querySelector(".header__categories-quantity") as HTMLElement);
		this.categoriesUIUpdate(0);
	}

	private categoriesUIUpdate(count: number) {
		console.log(`Количество выбранных категорий: ${count}`);

		if (count > 0) {
			document.querySelector(".header__categories-btn")?.classList.add("has-quantity");
			document.querySelector(".header__categories-reset")?.classList.add("visible");
		} else {
			document.querySelector(".header__categories-btn")?.classList.remove("has-quantity");
			document.querySelector(".header__categories-reset")?.classList.remove("visible");
		}
	}

	private languageUIUpdate(count: number) {
		console.log(`Количество выбранных языков: ${count}`);

		if (count > 0) {
			document.querySelector("[data-language-submit]")?.classList.remove("hide");
		} else {
			document.querySelector("[data-language-submit]")?.classList.add("hide");
		}
	}

	private toggleSubMenu(addButton: HTMLElement) {
		addButton.classList.toggle("active");
		const sortElement = document.querySelector(".header__sort") as HTMLElement | null;
		sortElement?.classList.toggle("active");
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

	private openModal(link: HTMLElement) {
		const modalId = link.getAttribute("href")?.replace("#", "");
		if (!modalId) return;

		const modal = document.getElementById(modalId);
		if (modal) {
			modal.classList.add("active");
			this.body.classList.add("lock");
		}
	}

	private closeModal() {
		const modal = document.querySelector(".modal.active") as HTMLElement | null;
		if (modal) {
			modal.classList.remove("active");
			this.body.classList.remove("lock");
		}
	}
}
