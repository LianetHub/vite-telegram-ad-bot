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
import { InputHandler } from "./inputHandler";
import { EmptyState } from "../components/Empty";
import { categoriesUIUpdate, toggleResetFilterBtn, calendarUIUpdate } from "../utils/uiActions";

export class UIHandler extends EventEmitter {
	public clickHandler: ClickHandler;
	public changeHandler: ChangeHandler;
	public inputHandler: InputHandler;
	private cartHandler: CartHandler;
	private filterHandler: FilterHandler;

	constructor() {
		super();
		this.cartHandler = new CartHandler();
		this.filterHandler = new FilterHandler();
		this.clickHandler = new ClickHandler(this);
		this.changeHandler = new ChangeHandler(this);
		this.inputHandler = new InputHandler(this);

		this.on("filters:change", this.filterHandler.handleFilterChanged.bind(this.filterHandler));

		this.on("filters:reset", () => {
			this.filterHandler.resetFilters(["sort_by", "weekly_sends", "monthly_growth"], () => toggleResetFilterBtn(["sort_by", "weekly_sends", "monthly_growth"]));
		});
		this.on("filters:categories-reset", () => {
			this.filterHandler.resetFilters(["categories"], () => categoriesUIUpdate(0));
		});
		this.on("filters:languages-reset", () => this.filterHandler.resetFilters(["languages"]));
		this.on("filters:search-reset", () => this.filterHandler.resetFilters(["search"]));
		this.on("filters:reset-all", () =>
			this.filterHandler.resetFilters([
				"languages",
				"premium",
				"price_type",
				"price_min",
				"price_max",
				"dates",
				"users_min",
				"users_max",
				"sort_by",
				"weekly_sends",
				"monthly_growth",
				"categories",
				"search",
			])
		);
		this.on("modal:opened", this.handleModalOpened);

		this.initApp();
	}

	private initApp() {
		this.initPriceRangeSlider();
		this.initUsersRangeSlider();
		this.initCalendar();

		store.subscribe("loading:start", this.showSkeleton.bind(this));

		store.subscribe("cards:empty", this.showEmptyState.bind(this));

		store.subscribe("cards:loaded", this.renderCards.bind(this));
		store.subscribe("cards:loaded", this.cartHandler.handleCartUpdate.bind(this.cartHandler));
		store.subscribe("cards:loading-error", this.showErrorLoading.bind(this));

		store.subscribe("cart:update", this.cartHandler.handleCartUpdate.bind(this.cartHandler));
		store.subscribe("cart:cleared", this.cartHandler.clearCartList.bind(this.cartHandler));
	}

	private initCalendar() {
		const calendarElement = document.getElementById("datepicker") as HTMLElement;

		if (calendarElement) {
			new Calendar(calendarElement, {
				// mode: "range",
				// range: false,
				onDateChange: calendarUIUpdate,
			});
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
		const appWrapper = document.querySelector("#app");

		if (!appWrapper) return;
		appWrapper.innerHTML = "";

		const skeleton = new SkeletonCardList(3);
		appWrapper.appendChild(skeleton.render());
	}

	private showEmptyState() {
		const appWrapper = document.querySelector("#app");

		if (!appWrapper) return;
		appWrapper.innerHTML = "";

		const emptyState = new EmptyState({
			message: "Нет результатов",
			showButton: false,
		});

		appWrapper.appendChild(emptyState.render());
	}

	private showErrorLoading() {
		const appWrapper = document.querySelector("#app");

		if (!appWrapper) return;
		appWrapper.innerHTML = "";

		const emptyState = new EmptyState({
			imageType: "empty",
			message: "Ошибка загрузки",
			subtitle: "Попробуйте позднее",
			showButton: false,
		});

		appWrapper.appendChild(emptyState.render());
	}
}
