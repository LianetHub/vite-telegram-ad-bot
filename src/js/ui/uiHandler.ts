import { store } from "./../store/store";
import { ClickHandler } from "./clickHandler";
import { ChangeHandler } from "./changeHandler";
import { EventEmitter } from "../store/EventEmitter";
import { RangeSlider } from "../components/RangeSlider";
import { CardList } from "../components/CardList";

export class UIHandler extends EventEmitter {
	private clickHandler: ClickHandler;
	private changeHandler: ChangeHandler;

	constructor() {
		super();
		this.clickHandler = new ClickHandler(this);
		this.changeHandler = new ChangeHandler(this);

		this.on("subMenuToggled", this.handleSubMenuToggled);
		this.on("categoriesToggled", this.handleCategoriesToggled);
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

	private handleCategoriesToggled(categoriesBtn: HTMLElement) {
		console.log("Категории переключены", categoriesBtn);
	}

	private handleModalOpened(modalLink: HTMLElement) {
		console.log("Модальное окно открыто", modalLink);
	}

	private renderCards() {
		const cardsContainer = document.querySelector("#app");
		if (!cardsContainer) return;

		cardsContainer.innerHTML = "";

		const cardList = new CardList(store.getState().cards);
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
		const totalElement = document.querySelector(".bag__total");

		if (totalElement) {
			const total = store.getState().total;
			if (total) {
				totalElement.textContent = `${total}`;
			}
		}
	}
}
