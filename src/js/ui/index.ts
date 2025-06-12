import { store } from "../store/store";
import { EventEmitter } from "../store/EventEmitter";
import { CartHandler } from "./handlers/cartHandler";
import { FilterHandler } from "./handlers/filterHandler";
import { ClickHandler } from "./handlers/clickHandler";
import { SearchHandler } from "./handlers/searchHandler";
import { StateRenderer } from "./StateRenderer";
import { CalendarInitializer } from "./initializers/CalendarInitializer";
import { Modal } from "../components/Modal";
import { Dropdown } from "../components/Dropdown";
import { Timepicker } from "../components/Timepicker";
import { removeLoading } from "../utils/buttonLoadingUtils";
import { LanguagesHandler } from "./handlers/languagesHandler";
import { SortFilterHandler } from "./handlers/sortFilterHandler";
import { PricesFilterHandler } from "./handlers/pricesHandler";
import { UsersFilterHandler } from "./handlers/usersHandler";

export class UIHandler extends EventEmitter {
	public clickHandler: ClickHandler;
	public searchHandler: SearchHandler;
	private cartHandler: CartHandler;
	private languagesHandler: LanguagesHandler;
	private sortFilterHandler: SortFilterHandler;
	private pricesFilterHandler: PricesFilterHandler;
	private usersFilterHandler: UsersFilterHandler;
	private filterHandler: FilterHandler;
	private stateRenderer: StateRenderer;

	private сalendarInitializer: CalendarInitializer;
	private modal: Modal;
	private isFirstLoad: boolean;

	constructor() {
		super();
		this.modal = new Modal(this);
		this.cartHandler = new CartHandler();
		this.searchHandler = new SearchHandler(this);
		this.сalendarInitializer = new CalendarInitializer(this, this.modal);
		this.pricesFilterHandler = new PricesFilterHandler(this, this.modal);
		this.usersFilterHandler = new UsersFilterHandler(this, this.modal);
		this.languagesHandler = new LanguagesHandler(this, this.modal);
		this.sortFilterHandler = new SortFilterHandler(this, this.modal);
		this.filterHandler = new FilterHandler(this, this.searchHandler, this.languagesHandler, this.sortFilterHandler, this.pricesFilterHandler, this.usersFilterHandler);
		this.clickHandler = new ClickHandler();
		this.stateRenderer = new StateRenderer();
		this.isFirstLoad = true;

		this.on("filters:change", (event: Event) => {
			this.filterHandler.handleFilterChanged(event, () => this.emit("filters:complete"));
		});

		this.on("filters:change-datepicker", (selectedDate: string[] | undefined) => {
			this.filterHandler.handleDateChange(selectedDate, () => {
				removeLoading(document.querySelector("[data-calendar-submit]") as HTMLButtonElement);
				this.emit("filters:complete");
				this.filterHandler.updateCalendarTogglerUI();
			});
		});

		this.on("filters:reset-datepicker", () => this.filterHandler.resetFilters(["dates"]));

		this.on("filters:reset", () => {
			this.filterHandler.resetFilters(["sort_by", "weekly_sends", "monthly_growth"]);
			this.sortFilterHandler.checkFilterSelection(["sort_by", "weekly_sends", "monthly_growth"]);
			this.sortFilterHandler.updateFilterButtonText();
		});

		this.on("filters:categories-reset", (update: boolean = false) => {
			this.filterHandler.resetFilters(
				["categories"],
				() => {
					this.filterHandler.categoriesUIUpdate(0);
					this.filterHandler.hideCategories();
				},
				update
			);
		});

		this.on("filters:prices-reset", (update: boolean = false) => {
			this.filterHandler.resetFilters(
				["price_type", "price_min", "price_max"],
				() => {
					const resetPricesBtn = document.querySelector("[data-prices-reset]") as HTMLButtonElement | null;
					this.pricesFilterHandler.updatePriceUI(true);
					this.pricesFilterHandler.updatePricesButtonText();
					resetPricesBtn?.classList.add("hidden");
				},
				update
			);
		});

		this.on("filters:users-reset", (update: boolean = false) => {
			this.filterHandler.resetFilters(
				["users_min", "users_max"],
				() => {
					const resetUsersBtn = document.querySelector("[data-users-reset]") as HTMLButtonElement | null;
					this.usersFilterHandler.updateUsersButtonText();
					resetUsersBtn?.classList.add("hidden");
				},
				update
			);
		});

		this.on("filters:languages-reset", () => {
			this.filterHandler.resetFilters(["languages", "premium"], () => {
				this.languagesHandler.updateLanguagesCompleteButtonText();
				this.stateRenderer.updateFiltersAvailability();
			});
		});

		this.on("filters:search-reset", (update: boolean = false) => {
			this.filterHandler.resetFilters(["search"], () => {}, update);
		});

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

		this.on("modal:opened", () => {
			this.filterHandler.hideCategories();
			this.searchHandler.hideSearch(0);
			store.saveTempFilters();
		});

		this.on("modal:closed-without-save", (modal: HTMLElement) => {
			store.restoreTempFilters();
			console.log("restore state", store.getState().filters);

			const currentModalId = modal.getAttribute("id");

			if (currentModalId === "filter") {
				setTimeout(() => {
					this.sortFilterHandler.updateSelectionItems();
					this.sortFilterHandler.updateFilterButtonText();
					this.sortFilterHandler.checkFilterSelection(["sort_by", "weekly_sends", "monthly_growth"]);
				}, 500);
			}

			if (currentModalId === "select-price") {
				setTimeout(() => {
					this.pricesFilterHandler.updatePriceUI(true);
					this.pricesFilterHandler.updatePricesButtonText();
				}, 500);
			}

			if (currentModalId === "select-language") {
				setTimeout(() => {
					this.languagesHandler.languageUIUpdate(undefined, true);
					this.languagesHandler.updateLanguagesCompleteButtonText();
					const languageQuantityElement = document.querySelector("[data-language-quantity]") as HTMLElement;
					this.filterHandler.updateCountersQuantity(languageQuantityElement, (count) => this.languagesHandler.languageUIUpdate(count));
				}, 500);
			}

			if (currentModalId === "select-users") {
				setTimeout(() => {
					this.usersFilterHandler.updateUsersUI(true);
					this.usersFilterHandler.updateUsersButtonText();
				}, 500);
			}
		});

		this.on("change-datepicker-type", this.сalendarInitializer.changeDatepickerType.bind(this));

		this.on("filters:premium-change", () => {
			this.stateRenderer.updateFiltersAvailability();
			this.stateRenderer.setFiltersValue();
			this.pricesFilterHandler.initPriceRangeSlider();
			this.usersFilterHandler.initUsersRangeSlider();
			const languageQuantityElement = document.querySelector("[data-language-quantity]") as HTMLElement;
			this.filterHandler.updateCountersQuantity(languageQuantityElement, (count) => this.languagesHandler.languageUIUpdate(count));
		});

		this.on("filters:price-type-change", () => {
			this.stateRenderer.setFiltersValue();
			this.pricesFilterHandler.initPriceRangeSlider();
		});

		this.initApp();
	}

	private initApp() {
		this.сalendarInitializer.initializeCalendars();
		document.querySelectorAll(".dropdown")?.forEach((dropdown) => new Dropdown(dropdown as HTMLElement));
		document.querySelectorAll(".timepicker")?.forEach((timepicker) => new Timepicker(timepicker as HTMLElement));

		store.subscribe("loading:start", () => {
			this.stateRenderer.showSkeleton();
		});
		store.subscribe("cards:loading-error", this.stateRenderer.showErrorLoading);

		store.subscribe("cards:loaded", () => {
			if (this.isFirstLoad) {
				console.log("Первая загрузка");
				this.stateRenderer.renderCards();
				store.updateTotalCart();
				this.cartHandler.handleCartUpdate.call(this.cartHandler);
				this.stateRenderer.updateFiltersAvailability();
				this.stateRenderer.setFiltersValue();
				this.pricesFilterHandler.initPriceRangeSlider();
				this.usersFilterHandler.initUsersRangeSlider();
				this.isFirstLoad = false;
			}
		});

		store.subscribe("cart:update", this.cartHandler.handleCartUpdate.bind(this.cartHandler));
		store.subscribe("cart:cleared", this.cartHandler.clearCartList.bind(this.cartHandler));
	}
}
