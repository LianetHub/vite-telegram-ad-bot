import { store } from "../store/store";
import { EventEmitter } from "../store/EventEmitter";
import { CartHandler } from "./handlers/cartHandler";
import { FilterHandler } from "./handlers/filterHandler";
import { ClickHandler } from "./handlers/clickHandler";
import { SearchHandler } from "./handlers/searchHandler";
import { StateRenderer } from "./StateRenderer";
import { RangeSliderInitializer } from "./initializers/RangeSliderInitializer";
import { CalendarInitializer } from "./initializers/CalendarInitializer";
import { Modal } from "../components/Modal";
import { Dropdown } from "../components/Dropdown";
import { Timepicker } from "../components/Timepicker";

export class UIHandler extends EventEmitter {
	public clickHandler: ClickHandler;
	public searchHandler: SearchHandler;
	private cartHandler: CartHandler;
	private filterHandler: FilterHandler;
	private stateRenderer: StateRenderer;
	private rangeSliderInitializer: RangeSliderInitializer;
	private сalendarInitializer: CalendarInitializer;
	private modal: Modal;
	private isFirstLoad: boolean;

	constructor() {
		super();
		this.modal = new Modal(this);
		this.cartHandler = new CartHandler();
		this.filterHandler = new FilterHandler(this, this.modal);
		this.clickHandler = new ClickHandler(this);
		this.searchHandler = new SearchHandler(this);
		this.stateRenderer = new StateRenderer();
		this.rangeSliderInitializer = new RangeSliderInitializer();
		this.сalendarInitializer = new CalendarInitializer(this, this.modal);
		this.isFirstLoad = true;

		this.on("filters:change", (event: Event) => {
			this.filterHandler.handleFilterChanged(event, () => this.emit("filters:complete"));
		});
		this.on("filters:change-datepicker", (selectedDate: string[] | undefined) => {
			this.filterHandler.handleDateChange(selectedDate, () => {
				document.querySelector("[data-calendar-submit]")?.classList.remove("loading");
				this.emit("filters:complete");
			});
		});
		this.on("filters:reset", () => {
			this.filterHandler.resetFilters(["sort_by", "weekly_sends", "monthly_growth"]);
			this.modal.closeModal();
			this.filterHandler.checkVisiblityResetFilterBtn(["sort_by", "weekly_sends", "monthly_growth"]);
		});
		this.on("filters:categories-reset", () => {
			this.filterHandler.resetFilters(["categories"], () => this.filterHandler.categoriesUIUpdate(0));
		});
		this.on("filters:prices-reset", () => {
			this.filterHandler.resetFilters(["price_type", "price_min", "price_max"], () => {
				const completePricesBtn = document.querySelector("[data-prices-complete]") as HTMLButtonElement;
				this.filterHandler.updateUIQuantityInBtn(completePricesBtn);
			});
		});
		this.on("filters:users-reset", () => {
			this.filterHandler.resetFilters(["users_min", "users_max"], () => {
				const completeUsersBtn = document.querySelector("[data-users-complete]") as HTMLButtonElement;
				this.filterHandler.updateUIQuantityInBtn(completeUsersBtn);
			});
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

		this.on("filters:complete", () => {
			console.log("Фильтр применен");
			this.modal.closeModal();
			this.stateRenderer.renderCards();
		});

		this.on("modal:opened", this.handleModalOpened);

		this.on("change-datepicker-type", this.сalendarInitializer.changeDatepickerType.bind(this));

		this.initApp();
	}

	private initApp() {
		this.rangeSliderInitializer.initializeSliders();
		this.сalendarInitializer.initializeCalendars();
		document.querySelectorAll(".dropdown")?.forEach((dropdown) => new Dropdown(dropdown as HTMLElement));
		document.querySelectorAll(".timepicker")?.forEach((timepicker) => new Timepicker(timepicker as HTMLElement));

		store.subscribe("loading:start", () => {
			this.stateRenderer.showSkeleton();
		});
		// store.subscribe("cards:empty", this.stateRenderer.showEmptyState);
		store.subscribe("cards:loading-error", this.stateRenderer.showErrorLoading);

		store.subscribe("cards:loaded", () => {
			if (this.isFirstLoad) {
				console.log("Первая загрузка");
				this.stateRenderer.renderCards();
				store.updateTotalCart();
				this.cartHandler.handleCartUpdate.call(this.cartHandler);
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
