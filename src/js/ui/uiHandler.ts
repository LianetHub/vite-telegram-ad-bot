import { store } from "../store/store";
import { EventEmitter } from "../store/EventEmitter";
import { RangeSlider } from "../components/RangeSlider";
import { Calendar } from "../components/Calendar";
import { CardList } from "../components/CardList";
import { SkeletonCardList } from "../components/Skeleton";
import { CartHandler } from "./cartHandler";
import { FilterHandler } from "./filterHandler";
import { ClickHandler } from "./clickHandler";
import { ChangeHandler } from "./changeHandler";

export class UIHandler extends EventEmitter {
	private clickHandler: ClickHandler;
	private changeHandler: ChangeHandler;
	private cartHandler: CartHandler;
	private filterHandler: FilterHandler;

	constructor() {
		super();
		this.cartHandler = new CartHandler();
		this.filterHandler = new FilterHandler();
		this.clickHandler = new ClickHandler(this);
		this.changeHandler = new ChangeHandler(this);

		this.on("filters:change", this.filterHandler.handleFilterChanged.bind(this.filterHandler));
		this.on("filters:reset", () => this.filterHandler.resetFilters(["sort_by", "weekly_sends", "monthly_growth"]));
		this.on("filters:categories-reset", () => this.filterHandler.resetFilters(["categories"]));
		this.on("filters:languages-reset", () => this.filterHandler.resetFilters(["languages"]));
		this.on("modal:opened", this.handleModalOpened);

		this.initApp();
	}

	private initApp() {
		this.initPriceRangeSlider();
		this.initUsersRangeSlider();
		this.initCalendar();

		store.subscribe("loading:start", this.showSkeleton.bind(this));
		store.subscribe("cards:loaded", this.renderCards.bind(this));
		store.subscribe("cards:loaded", this.cartHandler.handleCartUpdate.bind(this.cartHandler));
		store.subscribe("cart:update", this.cartHandler.handleCartUpdate.bind(this.cartHandler));
		store.subscribe("cart:totalUpdated", this.cartHandler.updateCartTotal.bind(this.cartHandler));
		store.subscribe("cart:cleared", this.cartHandler.clearCartList.bind(this.cartHandler));
	}

	private initCalendar() {
		const calendarElement = document.getElementById("datepicker") as HTMLElement;

		if (calendarElement) {
			const calendar = new Calendar("datepicker");
			console.log(calendar);
		}
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

	private handleModalOpened(modalLink: HTMLElement) {
		console.log("Модальное окно открыто", modalLink);
	}

	private renderCards(cards = store.getState().cards) {
		console.log("Рендер карточек");

		const appWrapper = document.querySelector("#app");
		if (!appWrapper) return;

		appWrapper.innerHTML = "";

		const cardList = new CardList(cards);
		appWrapper.appendChild(cardList.render());
	}

	private showSkeleton() {
		console.log("start loading");

		const appWrapper = document.querySelector("#app");

		if (!appWrapper) return;
		appWrapper.innerHTML = "";

		const skeleton = new SkeletonCardList(3);
		appWrapper.appendChild(skeleton.render());
	}
}
