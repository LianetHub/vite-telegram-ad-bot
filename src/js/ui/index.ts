import { store } from "../store/store";
import { EventEmitter } from "../store/EventEmitter";
import { CartHandler } from "./handlers/cartHandler";
import { FilterHandler } from "./handlers/filterHandler";
import { ClickHandler } from "./handlers/clickHandler";
import { ChangeHandler } from "./handlers/changeHandler";
import { InputHandler } from "./handlers/inputHandler";
import { StateRenderer } from "./StateRenderer";
import { SliderInitializer } from "./initializers/SliderInitializer";
import { CalendarInitializer } from "./initializers/CalendarInitializer";

import { categoriesUIUpdate, toggleResetFilterBtn, closeModal } from "../utils/uiActions";

export class UIHandler extends EventEmitter {
	public clickHandler: ClickHandler;
	public changeHandler: ChangeHandler;
	public inputHandler: InputHandler;
	private cartHandler: CartHandler;
	private filterHandler: FilterHandler;
	private stateRenderer: StateRenderer;
	private sliderInitializer: SliderInitializer;
	private сalendarInitializer: CalendarInitializer;
	private isFirstLoad: boolean;

	constructor() {
		super();
		this.cartHandler = new CartHandler();
		this.filterHandler = new FilterHandler();
		this.clickHandler = new ClickHandler(this);
		this.changeHandler = new ChangeHandler(this);
		this.inputHandler = new InputHandler(this);
		this.stateRenderer = new StateRenderer();
		this.sliderInitializer = new SliderInitializer();
		this.сalendarInitializer = new CalendarInitializer(this);

		this.isFirstLoad = true;

		this.on("filters:change", this.filterHandler.handleFilterChanged.bind(this.filterHandler));
		this.on("filters:change-datepicker", (selectedDate: string[] | undefined) => {
			this.filterHandler.handleDateChange(selectedDate, () => {
				document.querySelector("[data-calendar-submit]")?.classList.remove("loading");
				closeModal();
			});
		});
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

		this.on("change-datepicker-type", this.сalendarInitializer.changeDatepickerType.bind(this));

		this.initApp();
	}

	private initApp() {
		this.sliderInitializer.initializeSliders();
		this.сalendarInitializer.initializeCalendars();

		store.subscribe("loading:start", this.stateRenderer.showSkeleton);
		store.subscribe("cards:empty", this.stateRenderer.showEmptyState);
		store.subscribe("cards:loading-error", this.stateRenderer.showErrorLoading);
		store.subscribe("cards:loaded", this.stateRenderer.renderCards);

		store.subscribe("cards:loaded", () => {
			if (this.isFirstLoad) {
				this.cartHandler.handleCartUpdate.bind(this.cartHandler);
				this.isFirstLoad = false;
			}
		});
		store.subscribe("cart:update", this.cartHandler.handleCartUpdate.bind(this.cartHandler));
		store.subscribe("cart:cleared", this.cartHandler.clearCartList.bind(this.cartHandler));
	}

	private handleModalOpened(modalLink: HTMLElement) {
		console.log("Модальное окно открыто", modalLink);
	}
}
