import { store } from "../../store/store";
import { Category, SortBy, WeeklySends, MonthlyGrowth, LanguageCode, PriceType, SearchRequest } from "../../api/types";
import { EventEmitter } from "../../store/EventEmitter";
import { Modal } from "../../components/Modal";

export class FilterHandler {
	constructor(private eventEmitter: EventEmitter, private modal: Modal) {
		this.initEventListeners();
	}

	private initEventListeners() {
		document.addEventListener("click", (event: MouseEvent) => {
			const target = event.target as HTMLElement | null;
			if (!target) return;

			const categoriesBtn = target.closest(".header__categories-btn") as HTMLElement | null;
			if (categoriesBtn) {
				this.toggleCategories();
			}

			const categoriesHideBtn = target.closest(".header__categories-close") as HTMLElement | null;
			if (categoriesHideBtn) {
				this.hideCategories();
			}

			const categoriesResetBtn = target.closest("[data-categories-reset]") as HTMLElement | null;
			if (categoriesResetBtn) {
				this.eventEmitter.emit("filters:categories-reset");
				categoriesResetBtn.classList.add("loading");
			}

			const languagesResetBtn = target.closest("[data-reset-languages]") as HTMLElement | null;
			if (languagesResetBtn) {
				this.eventEmitter.emit("filters:languages-reset");
				this.languageUIUpdate(0);
			}

			const allFiltersResetBtn = target.closest("[data-clear-all-filters]") as HTMLElement | null;
			if (allFiltersResetBtn) {
				this.eventEmitter.emit("filters:reset-all");
				this.categoriesUIUpdate(0);
				this.languageUIUpdate(0);
			}

			const resetFilterBtn = target.closest("[data-reset-filter]") as HTMLElement | null;
			if (resetFilterBtn) {
				resetFilterBtn.classList.add("loading");
				this.eventEmitter.emit("filters:reset");
			}

			const completePricesBtn = target.closest("[data-prices-complete]") as HTMLButtonElement | null;
			if (completePricesBtn) {
				if (store.getState().cards.length == 0) {
					this.setLoading(completePricesBtn);
					this.eventEmitter.emit("filters:prices-reset");
				} else {
					this.eventEmitter.emit("filters:complete");
				}
			}

			const languageBtn = target.closest("[data-language-complete]") as HTMLButtonElement | null;
			if (languageBtn) {
				if (store.getState().cards.length !== 0) {
					this.eventEmitter.emit("filters:complete");
					this.modal.closeModal();
				}
			}

			const completeUsersBtn = target.closest("[data-users-complete]") as HTMLButtonElement | null;
			if (completeUsersBtn) {
				if (store.getState().cards.length == 0) {
					this.setLoading(completeUsersBtn);
					this.eventEmitter.emit("filters:users-reset");
				} else {
					this.eventEmitter.emit("filters:complete");
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
				this.handleFilterChanged(event, () => this.getFilterСallback(target.name));
			}

			if (target.classList.contains("segmented-controls__item-input")) {
				const segmentedControls = target.closest(".segmented-controls") as HTMLElement;
				this.handleSegmentedChange(segmentedControls, target.value);
			}

			if (target.classList.contains("modal__type-input")) {
				this.eventEmitter.emit("change-datepicker-type", event);
			}

			if (["sort_by", "weekly_sends", "monthly_growth"].includes(target.name)) {
				this.checkVisiblityResetFilterBtn([target.name]);
			}
		});
	}

	public handleFilterChanged(event: Event, callback?: () => void) {
		console.log("фильтр изменен");

		const target = event.target as HTMLInputElement;
		const filterName = target.name as keyof SearchRequest;

		const filterValue = this.getFilterValue(filterName);

		store.setFilters({ [filterName]: filterValue });

		Promise.resolve(store.fetchCards()).then(() => {
			if (callback) callback();
		});
	}

	public handleDateChange(date: string[] | undefined, callback?: () => void) {
		if (date === null) return;

		console.log("фильтр даты изменен");

		store.setFilters({ ["dates"]: date });

		Promise.resolve(store.fetchCards()).then(() => {
			if (callback) callback();
		});
	}

	private handleUIUpdate(filterName: string): undefined | void {
		const completePricesBtn = document.querySelector("[data-prices-complete]") as HTMLButtonElement;
		const completeUsersBtn = document.querySelector("[data-users-complete]") as HTMLButtonElement;
		const categoriesQuantityElement = document.querySelector("[data-categories-quantity]") as HTMLElement;
		const languageQuantityElement = document.querySelector("[data-language-quantity]") as HTMLElement;

		switch (filterName) {
			case "categories":
				return this.updateCountersQuantity(categoriesQuantityElement, (count) => this.categoriesUIUpdate(count));
			case "sort_by":
				return;
			case "weekly_sends":
				return;
			case "monthly_growth":
				return;
			case "price_type":
				return this.setLoading(completePricesBtn);
			case "price_min":
				return this.setLoading(completePricesBtn);
			case "price_max":
				return this.setLoading(completePricesBtn);
			case "users_min":
				return this.setLoading(completeUsersBtn);
			case "users_max":
				return this.setLoading(completeUsersBtn);
			case "languages":
				return this.updateCountersQuantity(languageQuantityElement, (count) => this.languageUIUpdate(count));
			case "premium":
				return;
			case "search":
				return;
			default:
				return undefined;
		}
	}

	private getFilterСallback(filterName: string): undefined | void {
		const completePricesBtn = document.querySelector("[data-prices-complete]") as HTMLButtonElement;
		const completeUsersBtn = document.querySelector("[data-users-complete]") as HTMLButtonElement;

		switch (filterName) {
			case "categories":
				return this.eventEmitter.emit("filters:complete");
			case "sort_by":
				return;
			case "weekly_sends":
				return;
			case "monthly_growth":
				return;
			case "price_type":
				return this.updateUIQuantityInBtn(completePricesBtn);
			case "price_min":
				return this.updateUIQuantityInBtn(completePricesBtn);
			case "price_max":
				return this.updateUIQuantityInBtn(completeUsersBtn);
			case "users_min":
				return this.updateUIQuantityInBtn(completeUsersBtn);
			case "users_max":
				return;
			case "languages":
				return;
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
		callback?: () => void
	) {
		console.log("Сброс фильтров: ", filterNames);
		filterNames.forEach((filterName) => this.resetFilter(filterName));

		store.setFilters(Object.fromEntries(filterNames.map((name) => [name, undefined])));

		Promise.resolve(store.fetchCards()).then(() => {
			if (callback) callback();
			this.eventEmitter.emit("filters:complete");
		});
	}

	private resetFilter(filterName: string) {
		const inputs = document.querySelectorAll<HTMLInputElement>(`input[name='${filterName}']`);

		inputs.forEach((input) => {
			if (input.type === "checkbox" || input.type === "radio") {
				input.checked = false;
			} else {
				input.dispatchEvent(new Event("reset", { bubbles: true }));
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
				return this.getSelectedFilter<WeeklySends>(filterName);
			case "monthly_growth":
				return this.getSelectedFilter<MonthlyGrowth>(filterName);
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
		const selectedValues = Array.from(document.querySelectorAll<HTMLInputElement>(`input[name='${name}']:checked`))
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

	// ui actions

	public checkVisiblityResetFilterBtn(filterNames: string | string[]) {
		const resetFilterBtn = document.querySelector<HTMLElement>("[data-reset-filter]");

		const filters = Array.isArray(filterNames) ? filterNames : [filterNames];

		const isAnyFilterSelected = filters.some(isFilterSelected);

		if (!isAnyFilterSelected) {
			resetFilterBtn?.classList.remove("loading");
		}
		if (resetFilterBtn) {
			resetFilterBtn.classList.toggle("hide", !isAnyFilterSelected);
		}

		function isFilterSelected(filterName: string): boolean {
			return document.querySelector(`input[name='${filterName}']:checked`) !== null;
		}
	}

	public categoriesUIUpdate(count: number) {
		if (count > 0) {
			document.querySelector(".header__categories-btn")?.classList.add("has-quantity");
			document.querySelector("[data-categories-reset]")?.classList.add("visible");
		} else {
			document.querySelector(".header__categories-btn")?.classList.remove("has-quantity");
			document.querySelector("[data-categories-reset]")?.classList.remove("visible");
			setTimeout(() => {
				document.querySelector("[data-categories-reset]")?.classList.remove("loading");
			}, 400);
		}
	}

	public updateCountersQuantity(element: HTMLElement, callback?: (count: number) => void) {
		const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="' + element.getAttribute("data-name") + '"]');
		const checkedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;

		element.innerText = checkedCount.toString();

		if (callback) {
			callback(checkedCount);
		}
	}

	public languageUIUpdate(count: number) {
		console.log(`Количество выбранных языков: ${count}`);
		const languageWrapper = document.querySelector(".language") as HTMLElement;
		if (count > 0) {
			document.querySelector("[data-language-complete]")?.classList.remove("hide");
			languageWrapper?.classList.add("modal-selected");
		} else {
			document.querySelector("[data-language-complete]")?.classList.add("hide");
			languageWrapper?.classList.remove("modal-selected");
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

	public updateUIQuantityInBtn(btn: HTMLButtonElement, type: "бот" = "бот") {
		if (!btn) return;

		const quantity = store.getState().cards.length;

		const getDeclension = (num: number, word: string): string => {
			if (num % 10 === 1 && num % 100 !== 11) return word;
			if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return `${word}а`;
			return `${word}ов`;
		};

		let priceSpan = btn.querySelector(".complete-btn__price");

		if (quantity > 0) {
			const text = `${quantity} ${getDeclension(quantity, type)}`;

			if (!priceSpan) {
				priceSpan = document.createElement("span");
				priceSpan.className = "complete-btn__price";
				btn.appendChild(priceSpan);
			}
			priceSpan.textContent = text;

			btn.textContent = "Показать все";

			btn.appendChild(priceSpan);

			btn.classList.remove("btn-primary-outline");
			btn.classList.add("btn-primary");
		} else {
			if (priceSpan) priceSpan.remove();

			btn.textContent = "Очистить";
			btn.classList.remove("btn-primary");
			btn.classList.add("btn-primary-outline");
		}

		this.removeLoading(btn);
	}

	public setLoading(btn: HTMLButtonElement) {
		return btn.classList.add("loading");
	}

	public removeLoading(btn: HTMLButtonElement) {
		return btn.classList.remove("loading");
	}

	private toggleCategories() {
		const wrapper = document.querySelector(".header__bottom") as HTMLElement | null;
		wrapper?.classList.toggle("open-categories");
		document.body.classList.toggle("lock");
	}

	private hideCategories() {
		const wrapper = document.querySelector(".header__bottom") as HTMLElement | null;
		wrapper?.classList.remove("open-categories");
		document.body.classList.remove("lock");
	}
}
