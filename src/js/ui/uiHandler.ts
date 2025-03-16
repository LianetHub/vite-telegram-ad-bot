import { Category } from "./../api/types";
import { store } from "./../store/store";
import { ClickHandler } from "./clickHandler";
import { ChangeHandler } from "./changeHandler";
import { EventEmitter } from "../store/EventEmitter";
import { RangeSlider } from "../components/RangeSlider";
import { CardList } from "../components/CardList";
import { addThousandSeparator } from "../utils/addThousandSeparator";

export class UIHandler extends EventEmitter {
	private clickHandler: ClickHandler;
	private changeHandler: ChangeHandler;

	constructor() {
		super();
		this.clickHandler = new ClickHandler(this);
		this.changeHandler = new ChangeHandler(this);

		this.on("subMenuToggled", this.handleSubMenuToggled);

		this.on("categories:change", this.handleCategoriesChanged.bind(this));

		this.on("modalOpened", this.handleModalOpened);

		this.initApp();
	}

	private initApp() {
		this.initPriceRangeSlider();
		this.initUsersRangeSlider();

		store.subscribe("cards:loaded", this.renderCards.bind(this));
		store.subscribe("cards:loaded", this.handleCartUpdate.bind(this));
		store.subscribe("cart:update", this.handleCartUpdate.bind(this));
		store.subscribe("cart:totalUpdated", this.updateCartTotal.bind(this));
		store.subscribe("cart:cleared", this.clearCartList.bind(this));
	}

	private initPriceRangeSlider() {
		const rangePrice = document.querySelector("#range-price") as HTMLElement;
		const rangePriceMinInput = document.querySelector("#start-price-input") as HTMLInputElement;
		const rangePriceMaxInput = document.querySelector("#end-price-input") as HTMLInputElement;

		if (rangePrice && rangePriceMinInput && rangePriceMaxInput) {
			new RangeSlider(rangePrice, rangePriceMinInput, rangePriceMaxInput);
		}
	}

	private initUsersRangeSlider() {
		const rangeUsers = document.querySelector("#range-users") as HTMLElement;
		const rangeUsersMinInput = document.querySelector("#start-users-input") as HTMLInputElement;
		const rangeUsersMaxInput = document.querySelector("#end-users-input") as HTMLInputElement;

		if (rangeUsers && rangeUsersMinInput && rangeUsersMaxInput) {
			new RangeSlider(rangeUsers, rangeUsersMinInput, rangeUsersMaxInput);
		}
	}

	private handleSubMenuToggled(addButton: HTMLElement) {
		console.log("Подменю переключено", addButton);
	}

	private handleModalOpened(modalLink: HTMLElement) {
		console.log("Модальное окно открыто", modalLink);
	}

	private renderCards(cards = store.getState().cards) {
		console.log("render cards");

		const cardsContainer = document.querySelector("#app");
		if (!cardsContainer) return;

		cardsContainer.innerHTML = "";

		const cardList = new CardList(cards);
		cardsContainer.appendChild(cardList.render());
	}

	private handleCartUpdate() {
		const cartQuantity = store.getState().cart.length;

		const bagElement = document.querySelector(".bag");
		if (bagElement) {
			if (cartQuantity > 0) {
				bagElement.classList.add("visible");
			} else {
				bagElement.classList.remove("visible");
			}
		}
	}

	private updateCartTotal() {
		const totalElements = document.querySelectorAll("[data-total-price]");

		if (totalElements.length) {
			let totalPrice = store.getState().total ?? 0;

			totalElements.forEach((totalElement) => {
				totalElement.textContent = `${addThousandSeparator(totalPrice)} ₽`;
			});
		}
	}

	private clearCartList() {
		const cartList = document.querySelector("#cart-list") as HTMLElement | null;
		const cartContent = document.querySelector(".cart__content") as HTMLElement | null;
		const cartEmptyBlock = document.querySelector(".cart__empty") as HTMLElement | null;
		cartContent?.classList.add("removed");
		cartEmptyBlock?.classList.remove("hide");

		if (cartList) {
			setTimeout(() => {
				cartList.innerHTML = "";
				cartContent?.classList.add("hidden");
				cartContent?.classList.remove("removed");
			}, 300);
		}
	}

	private getSelectedCategories(): string {
		return Array.from(document.querySelectorAll("input[name='category']:checked"))
			.map((input) => (input as HTMLInputElement).value as Category)
			.join(",");
	}

	public handleCategoriesChanged() {
		console.log("Категории Изменены");
		const selectedCategories = this.getSelectedCategories();
		store.setFilters({
			categories: selectedCategories,
		});
		store.fetchCards();
	}
}
