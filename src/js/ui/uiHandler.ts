import { store } from "../store/store";
import { EventEmitter } from "../store/EventEmitter";
import { RangeSlider } from "../components/RangeSlider";
import { Calendar, HTMLElementWithDatepicker } from "../components/Calendar";
import { CardList } from "../components/CardList";
import { SkeletonCardList } from "../components/Skeleton";
import { CartHandler } from "./cartHandler";
import { FilterHandler } from "./filterHandler";
import { ClickHandler } from "./clickHandler";
import { ChangeHandler } from "./changeHandler";
import { InputHandler } from "./inputHandler";
import { EmptyState } from "../components/Empty";
import { categoriesUIUpdate, toggleResetFilterBtn, calendarUIUpdate, closeModal, openModal } from "../utils/uiActions";

export class UIHandler extends EventEmitter {
	public clickHandler: ClickHandler;
	public changeHandler: ChangeHandler;
	public inputHandler: InputHandler;
	private cartHandler: CartHandler;
	private filterHandler: FilterHandler;
	private isFirstLoad: boolean;

	constructor() {
		super();
		this.cartHandler = new CartHandler();
		this.filterHandler = new FilterHandler();
		this.clickHandler = new ClickHandler(this);
		this.changeHandler = new ChangeHandler(this);
		this.inputHandler = new InputHandler(this);

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
		this.on("change-datepicker-type", this.changeDatepickerType.bind(this));

		this.initApp();
	}

	private initApp() {
		this.initPriceRangeSlider();
		this.initUsersRangeSlider();
		this.initCalendar();

		store.subscribe("loading:start", this.showSkeleton.bind(this));

		store.subscribe("cards:empty", this.showEmptyState.bind(this));

		store.subscribe("cards:loaded", this.renderCards.bind(this));

		store.subscribe("cards:loaded", () => {
			if (this.isFirstLoad) {
				this.cartHandler.handleCartUpdate.bind(this.cartHandler);
				this.isFirstLoad = false;
			}
		});

		store.subscribe("cards:loading-error", this.showErrorLoading.bind(this));

		store.subscribe("cart:update", this.cartHandler.handleCartUpdate.bind(this.cartHandler));
		store.subscribe("cart:cleared", this.cartHandler.clearCartList.bind(this.cartHandler));
	}

	private initCalendar() {
		const calendarElement = document.getElementById("datepicker") as HTMLElement;

		if (calendarElement) {
			const calendarWrapper = calendarElement.closest(".calendar") as HTMLElement;
			const calendarInstanse = new Calendar(calendarElement, {
				onDateChange: (selectedDate) => {
					calendarUIUpdate(selectedDate, calendarWrapper, calendarInstanse);
					console.log(calendarInstanse.mode);
				},
				onDateSubmit: (selectedDate) => {
					this.emit("filters:change-datepicker", selectedDate);
				},
			});
		}

		const calendarAvailableElement = document.getElementById("datepicker-available") as HTMLElement;

		if (calendarAvailableElement) {
			const calendarAvailableWrapper = calendarAvailableElement.closest(".calendar") as HTMLElement;
			const calendarInstanse = new Calendar(calendarAvailableElement, {
				onDateChange: (selectedDate) => {
					calendarUIUpdate(selectedDate, calendarAvailableWrapper, calendarInstanse);
					console.log(calendarInstanse.mode);
				},
				onDateSubmit: (selectedDate) => {
					closeModal();
					openModal("#check-available-time");
				},
			});
		}
	}

	private changeDatepickerType(event: Event) {
		const target = event.target as HTMLInputElement;
		const type = target.value as "single" | "range";
		const currentDatepicker = target.closest(".calendar") as HTMLElementWithDatepicker;
		const DatepickerIntanse = currentDatepicker?.datepicker as Calendar | null;
		if (DatepickerIntanse) {
			DatepickerIntanse.setMode(type);
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
