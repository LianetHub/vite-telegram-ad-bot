import { store } from "../../store/store";
import moment from "moment";
import { Category, SortBy, WeeklySends, LanguageCode, PriceType, SearchRequest } from "../../api/types";
import { EventEmitter } from "../../store/EventEmitter";
import { addLoading, removeLoading } from "../../utils/buttonLoadingUtils";
import { SearchHandler } from "./searchHandler";
import { LanguagesHandler } from "./languagesHandler";
import { SortFilterHandler } from "./sortFilterHandler";
import { PricesFilterHandler } from "./pricesHandler";
import { UsersFilterHandler } from "./usersHandler";

export class FilterHandler {
	private resizeObserver: ResizeObserver | null = null;

	constructor(
		private eventEmitter: EventEmitter,
		private searchHandler: SearchHandler,
		private languagesHandler: LanguagesHandler,
		private sortFilterHandler: SortFilterHandler,
		private pricesFilterHandler: PricesFilterHandler,
		private usersFilterHandler: UsersFilterHandler
	) {
		this.initEventListeners();
		this.resizeObserver = null;
	}

	private initEventListeners() {
		document.addEventListener("click", (event: MouseEvent) => {
			const target = event.target as HTMLElement | null;
			if (!target) return;

			const addButton = target.closest(".header__add") as HTMLElement | null;
			if (addButton) {
				this.toggleSubMenu(addButton);
			}

			const categoriesBtn = target.closest(".header__categories-btn") as HTMLElement | null;
			if (categoriesBtn) {
				this.toggleCategories();
				this.searchHandler.hideAndClearSearch();
			}

			const categoriesHideBtn = target.closest(".header__categories-close") as HTMLElement | null;
			if (categoriesHideBtn) {
				this.hideCategories();
			}

			const categoriesResetBtn = target.closest("[data-categories-reset]") as HTMLButtonElement | null;
			if (categoriesResetBtn) {
				this.eventEmitter.emit("filters:categories-reset", true);
				addLoading(categoriesResetBtn);
			}

			const btnResetSort = target.closest(".btn__reset") as HTMLElement | null;
			if (btnResetSort) {
				let btnWrapper = btnResetSort?.closest(".header__sort-btn");

				if (btnWrapper?.getAttribute("href") === "#select-date") {
					this.removeDateTogglerState();
					const mainCalendarResetBtn = document.querySelector("[data-main-calendar-reset]") as HTMLButtonElement | null;
					mainCalendarResetBtn?.click();
				}
			}
		});

		document.addEventListener("change", (event: Event) => {
			const target = event.target as HTMLInputElement;

			const filterNames = [
				"languages",
				"premium",
				"dates",
				"sort_by",
				"weekly_sends",
				"monthly_growth",
				"categories",
				"price_type",
				"users_min",
				"users_max",
				"price_min",
				"price_max",
			];

			if (filterNames.includes(target.name)) {
				this.handleUIUpdate(target.name);
				const showLoading = !(
					target.name === "premium" ||
					target.name === "sort_by" ||
					target.name === "weekly_sends" ||
					target.name === "monthly_growth" ||
					target.name === "languages" ||
					target.name === "users_min" ||
					target.name === "users_max" ||
					target.name === "price_min" ||
					target.name === "price_max" ||
					target.name === "price_type"
				);

				this.handleFilterChanged(event, () => this.getFilterСallback(target.name), showLoading);
			}

			if (target.classList.contains("segmented-controls__item-input")) {
				const segmentedControls = target.closest(".segmented-controls") as HTMLElement;
				this.handleSegmentedChange(segmentedControls, target.value);
			}

			if (target.classList.contains("modal__type-input")) {
				this.eventEmitter.emit("change-datepicker-type", event);
			}
		});
	}

	public handleFilterChanged(event: Event, callback?: () => void, showLoading: boolean = true) {
		if (store.getState().isSilent) return;

		const target = event.target as HTMLInputElement;
		const filterName = target.name as keyof SearchRequest;

		const filterValue = this.getFilterValue(filterName);

		store.setFilters({ [filterName]: filterValue });

		if (filterName == "price_type") return;

		console.log("Запрос при handleFilterChanged");

		Promise.resolve(store.fetchCards(showLoading)).then(() => {
			if (callback) callback();
		});
	}

	public handleDateChange(date: string[] | undefined, callback?: () => void) {
		if (date === null) return;

		console.log("фильтр даты изменен");
		store.setFilters({ ["dates"]: date });

		console.log("Запрос при handleDateChange");
		Promise.resolve(store.fetchCards()).then(() => {
			if (callback) callback();
		});
	}

	private handleUIUpdate(filterName: string): undefined | void {
		const completePricesBtn = document.querySelector("[data-prices-complete]") as HTMLButtonElement;
		const completeUsersBtn = document.querySelector("[data-users-complete]") as HTMLButtonElement;
		const categoriesQuantityElement = document.querySelector("[data-categories-quantity]") as HTMLElement;
		const languageQuantityElement = document.querySelector("[data-language-quantity]") as HTMLElement;
		const languageCompleteBtn = document.querySelector("[data-language-complete]") as HTMLButtonElement;
		const filterCompleteBtn = document.querySelector("[data-filter-complete]") as HTMLButtonElement;

		switch (filterName) {
			case "categories":
				return this.updateCountersQuantity(categoriesQuantityElement, (count) => this.categoriesUIUpdate(count));
			case "sort_by":
				return this.sortFilterHandler.checkFilterSelection(["sort_by", "weekly_sends", "monthly_growth"]);
			case "weekly_sends":
				this.sortFilterHandler.checkFilterSelection(["sort_by", "weekly_sends", "monthly_growth"]);
				return addLoading(filterCompleteBtn);
			case "monthly_growth":
				this.sortFilterHandler.checkFilterSelection(["sort_by", "weekly_sends", "monthly_growth"]);
				return addLoading(filterCompleteBtn);
			case "price_type":
				setTimeout(() => {
					this.recalcPriceValues();
					this.eventEmitter.emit("filters:price-type-change");
				}, 0);
				return addLoading(completePricesBtn);
			case "price_min":
				return addLoading(completePricesBtn);
			case "price_max":
				return addLoading(completePricesBtn);
			case "users_min":
				return addLoading(completeUsersBtn);
			case "users_max":
				return addLoading(completeUsersBtn);
			case "languages":
				addLoading(languageCompleteBtn);
				return this.updateCountersQuantity(languageQuantityElement, (count) => this.languagesHandler.languageUIUpdate(count));
			case "premium":
				return;
			case "search":
				return;
			default:
				return undefined;
		}
	}

	private getFilterСallback(filterName: string): undefined | void {
		switch (filterName) {
			case "categories":
				return this.eventEmitter.emit("filters:complete");
			case "sort_by":
				return this.sortFilterHandler.updateFilterButtonText();
			case "weekly_sends":
				return this.sortFilterHandler.updateFilterButtonText();
			case "monthly_growth":
				return this.sortFilterHandler.updateFilterButtonText();
			case "price_type":
				// this.eventEmitter.emit("filters:price-type-change");
				return this.pricesFilterHandler.updatePricesButtonText();
			case "price_min":
				return this.pricesFilterHandler.updatePricesButtonText();
			case "price_max":
				return this.pricesFilterHandler.updatePricesButtonText();
			case "users_min":
				return this.usersFilterHandler.updateUsersButtonText();
			case "users_max":
				return this.usersFilterHandler.updateUsersButtonText();
			case "languages":
				return this.languagesHandler.updateLanguagesCompleteButtonText();
			case "premium":
				return;
			case "search":
				return this.eventEmitter.emit("filters:complete");
			default:
				return undefined;
		}
	}

	public resetFilters(
		filterNames: (keyof SearchRequest)[] = [
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
		],
		callback?: () => void,
		update: boolean = false
	) {
		console.log("Сброс фильтров: ", filterNames);

		store.setSilent();
		// store.saveTempFilters();

		filterNames.forEach((filterName) => this.resetFilter(filterName));
		store.setFilters(Object.fromEntries(filterNames.map((name) => [name, undefined])));

		console.log("Запрос при сбросе фильтров");
		Promise.resolve(store.fetchCards(update)).then(() => {
			if (callback) callback();
			if (update) {
				this.eventEmitter.emit("filters:complete");
			}
			store.removeSilent();
		});
	}

	private resetFilter(filterName: string) {
		const inputs = document.querySelectorAll<HTMLInputElement>(`input[name='${filterName}']`);

		inputs.forEach((input) => {
			if (input.type === "checkbox") {
				input.checked = false;
			} else if (input.type === "radio") {
				if (input.defaultChecked) {
					input.click();
				}
			} else {
				if (input.name !== "price_min" && input.name !== "price_max") {
					input.value = "";
				}
				input.dispatchEvent(new Event("reset", { bubbles: true }));
			}

			if (input.name == "premium") {
				const languageQuantityElement = document.querySelector("[data-language-quantity]") as HTMLElement;
				this.updateCountersQuantity(languageQuantityElement, (count) => this.languagesHandler.languageUIUpdate(count));
			}
		});
	}

	private getFilterValue(filterName: string): string | number | boolean | undefined {
		switch (filterName) {
			case "categories":
				return this.getSelectedString<Category>(filterName);
			case "sort_by":
				return this.getSelectedFilter<SortBy>(filterName);
			case "weekly_sends":
				return this.getSelectedString<WeeklySends>(filterName);
			case "monthly_growth":
				return this.getFieldString(filterName);
			case "price_type":
				return this.getSelectedFilter<PriceType>(filterName);
			case "price_min":
				return this.getFieldNumber(filterName);
			case "price_max":
				return this.getFieldNumber(filterName);
			case "users_min":
				return this.getFieldNumber(filterName);
			case "users_max":
				return this.getFieldNumber(filterName);
			case "languages":
				return this.getSelectedString<LanguageCode>(filterName);
			case "premium":
				return this.getSelectedBoolean(filterName);
			case "search":
				return this.getFieldString(filterName);
			default:
				return undefined;
		}
	}

	private getSelectedString<T>(name: string): string | undefined {
		const selectedValues = Array.from(document.querySelectorAll<HTMLInputElement>(`input[name='${name}']:checked:not(:disabled)`))
			.map((input) => input.value as T)
			.join(",");
		return selectedValues || undefined;
	}

	private getFieldNumber(name: string): number | undefined {
		const fieldValue = document.querySelector<HTMLInputElement>(`input[name='${name}']`)?.value.replace(/\s+/g, "");

		if (fieldValue) {
			const parsedValue = parseFloat(fieldValue);
			return isNaN(parsedValue) ? undefined : parsedValue;
		}

		return undefined;
	}

	private getFieldString(name: string): string | undefined {
		const fieldValue = document.querySelector<HTMLInputElement>(`input[name='${name}']`)?.value.toLowerCase();

		return fieldValue || undefined;
	}

	private getSelectedBoolean(name: string): boolean {
		const input = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
		return input?.checked ?? false;
	}

	private getSelectedFilter<T>(filterName: string): T | undefined {
		const selectedInput = document.querySelector<HTMLInputElement>(`input[name='${filterName}']:checked`);
		return selectedInput ? (selectedInput.value as T) : undefined;
	}

	private recalcPriceValues(): void {
		const state = store.getState();
		const { price_type, price_min, price_max, premium } = state.filters;
		const { price_total, price_per_100k } = state.filtersData?.static || {};

		if ((price_min != null || price_max != null) && price_total && price_per_100k) {
			const userType: keyof typeof price_total.min = premium ? "premium" : "non_premium";

			const totalMin = price_total.min[userType];
			const totalMax = price_total.max[userType];

			const per100kMin = price_per_100k.min[userType];
			const per100kMax = price_per_100k.max[userType];

			const getProgress = (value: number, min: number, max: number): number => {
				if (max === min) return 0;
				return Math.min(Math.max((value - min) / (max - min), 0), 1);
			};

			const interpolate = (min: number, max: number, progress: number): number => {
				return Math.round(min + (max - min) * progress);
			};

			let convertedMin: number | undefined;
			let convertedMax: number | undefined;

			if (price_type === "per_100k") {
				convertedMin = price_min != null ? interpolate(per100kMin, per100kMax, getProgress(price_min, totalMin, totalMax)) : undefined;

				convertedMax = price_max != null ? interpolate(per100kMin, per100kMax, getProgress(price_max, totalMin, totalMax)) : undefined;
			} else if (price_type === "total") {
				convertedMin = price_min != null ? interpolate(totalMin, totalMax, getProgress(price_min, per100kMin, per100kMax)) : undefined;

				convertedMax = price_max != null ? interpolate(totalMin, totalMax, getProgress(price_max, per100kMin, per100kMax)) : undefined;
			}

			store.setFilters({
				price_min: convertedMin,
				price_max: convertedMax,
			});
		}

		console.log("После перерасчета", store.getState().filters);
	}

	// ui actions

	public categoriesUIUpdate(count: number) {
		if (count > 0) {
			document.querySelector(".header__categories-btn")?.classList.add("has-quantity");
			document.querySelector("[data-categories-reset]")?.classList.add("visible");
		} else {
			document.querySelector(".header__categories-btn")?.classList.remove("has-quantity");
			document.querySelector("[data-categories-reset]")?.classList.remove("visible");
			setTimeout(() => {
				removeLoading(document.querySelector("[data-categories-reset]"));
			}, 400);
		}
	}

	public updateCountersQuantity(element: HTMLElement, callback?: (count: number) => void) {
		const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="' + element.getAttribute("data-name") + '"]');
		const checkedCount = Array.from(checkboxes).filter((checkbox) => {
			if (checkbox.checked && !checkbox.disabled) {
				console.log("checkbox", checkbox);
			}
			return checkbox.checked && !checkbox.disabled;
		}).length;

		console.log("checkedCount", checkedCount);

		if (checkedCount.toString() == "0") {
			element.innerText = "";
		} else {
			element.innerText = checkedCount.toString();
		}

		if (callback) {
			callback(checkedCount);
		}
	}

	public handleSegmentedChange(controls: HTMLElement, value: string) {
		const buttons = controls?.querySelectorAll(".segmented-controls__item") as NodeListOf<HTMLElement>;
		const runner = controls?.querySelector(".segmented-controls__runner") as HTMLElement;

		let activeIndex = 0;

		buttons.forEach((button, index) => {
			const input = button.querySelector("input") as HTMLInputElement;
			if (input && input.value === value) {
				activeIndex = index;
			}
		});

		if (buttons.length > 0 && runner) {
			const activeButton = buttons[activeIndex];

			buttons.forEach((button) => {
				button.classList.remove("active");
			});

			activeButton.classList.add("active");
			runner.style.left = `${activeIndex * 50}%`;
		}
	}

	public getBotsStateInfo<K extends keyof SearchRequest>(keys: K[]) {
		const state = store.getState();
		const quantity = state.cards.length;
		const filters = state.filters;

		const filtersSubset = {} as Pick<SearchRequest, K>;

		keys.forEach((key) => {
			filtersSubset[key] = filters[key];
		});

		const isAllFiltersUndefined = keys.every((key) => filters[key] === undefined);

		return {
			quantity,
			filters: filtersSubset,
			isAllFiltersUndefined,
		};
	}

	public toggleCategories() {
		const wrapper = document.querySelector(".header__bottom") as HTMLElement | null;
		const header = document.querySelector(".header") as HTMLElement | null;
		const categoriesBody = document.querySelector(".header__categories-body") as HTMLElement | null;

		if (!wrapper || !header || !categoriesBody) return;

		wrapper.classList.toggle("open-categories");
		document.body.classList.toggle("lock");

		const updateHeight = () => {
			const headerHeight = header.offsetHeight;
			const scrollY = window.scrollY;
			const availableHeight = headerHeight - scrollY;
			categoriesBody.style.height = `calc(100vh - ${availableHeight}px)`;
		};

		if (wrapper.classList.contains("open-categories")) {
			updateHeight();
			categoriesBody.scrollTop = 0;

			this.resizeObserver = new ResizeObserver(updateHeight);
			this.resizeObserver.observe(header);

			window.addEventListener("scroll", updateHeight);
		} else {
			categoriesBody.style.height = "";

			this.resizeObserver?.disconnect();
			this.resizeObserver = null;

			window.removeEventListener("scroll", updateHeight);
		}
	}

	public hideCategories() {
		const wrapper = document.querySelector(".header__bottom") as HTMLElement | null;
		wrapper?.classList.remove("open-categories");
		document.body.classList.remove("lock-categories");
	}

	public toggleSubMenu(addButton: HTMLElement) {
		addButton.classList.toggle("active");
		const sortElement = document.querySelector(".header__sort") as HTMLElement | null;
		sortElement?.classList.toggle("active");
	}

	public hideSubMenu() {
		const addButton = document.querySelector(".header__add") as HTMLElement | null;
		addButton?.classList.remove("active");
		const sortElement = document.querySelector(".header__sort") as HTMLElement | null;
		sortElement?.classList.remove("active");
	}

	public updateCalendarTogglerUI() {
		const btn = document.querySelector("[data-date-toggler]");
		const btnWrapperText = btn?.querySelector(".btn__value") as HTMLElement;
		btn?.classList.add("selected");

		const { dates } = store.getState().filters;

		if (dates) {
			const formattedDates = dates.map((date) => moment.unix(Number(date)).format("DD.MM"));

			if (formattedDates.length === 1) {
				btnWrapperText.textContent = formattedDates[0];
			} else if (formattedDates.length > 1) {
				let result = "";
				let startDate = formattedDates[0];
				let endDate = formattedDates[0];

				for (let i = 1; i < formattedDates.length; i++) {
					const currentDate = moment(formattedDates[i], "DD.MM");
					const previousDate = moment(formattedDates[i - 1], "DD.MM");

					if (currentDate.isSame(previousDate.add(1, "days"), "day")) {
						endDate = formattedDates[i];
					} else {
						if (startDate === endDate) {
							result += `${startDate}, `;
						} else {
							result += `${startDate} - ${endDate}, `;
						}

						startDate = formattedDates[i];
						endDate = formattedDates[i];
					}
				}

				if (startDate === endDate) {
					result += `${startDate}`;
				} else {
					result += `${startDate} - ${endDate}`;
				}

				btnWrapperText.textContent = result;
			}
		}
	}

	public removeTogglerState(selector: string, defaultText: string) {
		const btnToggler = document.querySelector(selector);
		btnToggler?.classList.remove("selected");
		const btnWrapperText = btnToggler?.querySelector(".btn__value") as HTMLElement;
		btnWrapperText.textContent = defaultText;
	}

	public removeDateTogglerState() {
		this.removeTogglerState("[data-date-toggler]", "Дата");
	}
}
