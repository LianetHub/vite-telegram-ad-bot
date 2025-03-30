import { store } from "../store/store";
import { EventEmitter } from "../store/EventEmitter";
import { CartHandler } from "./handlers/cartHandler";
import { FilterHandler } from "./handlers/filterHandler";
import { ClickHandler } from "./handlers/clickHandler";
import { SearchHandler } from "./handlers/searchHandler";
import { StateRenderer } from "./StateRenderer";
import { SliderInitializer } from "./initializers/SliderInitializer";
import { CalendarInitializer } from "./initializers/CalendarInitializer";
import { Modal } from "../components/Modal";

export class UIHandler extends EventEmitter {
	public clickHandler: ClickHandler;
	public searchHandler: SearchHandler;
	private cartHandler: CartHandler;
	private filterHandler: FilterHandler;
	private stateRenderer: StateRenderer;
	private sliderInitializer: SliderInitializer;
	private сalendarInitializer: CalendarInitializer;
	private modal: Modal;
	private isFirstLoad: boolean;

	constructor() {
		super();
		this.modal = new Modal(this);
		this.cartHandler = new CartHandler();
		this.filterHandler = new FilterHandler(this);
		this.clickHandler = new ClickHandler(this);
		this.searchHandler = new SearchHandler(this);
		this.stateRenderer = new StateRenderer();
		this.sliderInitializer = new SliderInitializer();
		this.сalendarInitializer = new CalendarInitializer(this, this.modal);
		this.isFirstLoad = true;

		this.on("filters:change", this.filterHandler.handleFilterChanged.bind(this.filterHandler));
		this.on("filters:change-datepicker", (selectedDate: string[] | undefined) => {
			this.filterHandler.handleDateChange(selectedDate, () => {
				document.querySelector("[data-calendar-submit]")?.classList.remove("loading");
				this.modal.closeModal();
			});
		});
		this.on("filters:reset", () => {
			this.filterHandler.resetFilters(["sort_by", "weekly_sends", "monthly_growth"], () => {
				this.modal.closeModal();
				this.filterHandler.checkVisiblityResetFilterBtn(["sort_by", "weekly_sends", "monthly_growth"]);
			});
		});
		this.on("filters:categories-reset", () => {
			this.filterHandler.resetFilters(["categories"], () => this.filterHandler.categoriesUIUpdate(0));
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
