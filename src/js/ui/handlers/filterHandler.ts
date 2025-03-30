import { store } from "../../store/store";
import { Category, SortBy, WeeklySends, MonthlyGrowth, LanguageCode, PriceType, SearchRequest } from "../../api/types";
import { EventEmitter } from "../../store/EventEmitter";

export class FilterHandler {
	constructor(private eventEmitter: EventEmitter) {
		this.initEventListeners();
	}

	private initEventListeners() {
		document.addEventListener("click", (event: MouseEvent) => {
			const target = event.target as HTMLElement | null;
			if (!target) return;

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
		});

		document.addEventListener("change", (event: Event) => {
			const target = event.target as HTMLInputElement;

			const filterNames = [
				"languages",
				"premium",
				"price_type",
				"dates",
				"users_min",
				"users_max",
				"sort_by",
				"weekly_sends",
				"monthly_growth",
				"categories",
				"price_min",
				"price_max",
				"users_min",
				"users_max",
			];
			if (filterNames.includes(target.name)) {
				this.eventEmitter.emit("filters:change", event);
			}

			const uiUpdates: { [key: string]: { selector: string; callback: (count: number) => void } } = {
				categories: {
					selector: ".header__categories-quantity",
					callback: this.categoriesUIUpdate,
				},
				languages: {
					selector: ".modal__language-quantity",
					callback: this.languageUIUpdate,
				},
			};

			if (uiUpdates[target.name]) {
				const { selector, callback } = uiUpdates[target.name];
				const quantityElement = document.querySelector(selector) as HTMLElement;
				if (quantityElement) {
					this.updateCountersQuantity(quantityElement, (count) => callback(count));
				}
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
		});
	}

	private resetFilter(filterName: string) {
		const selectedInputs = document.querySelectorAll<HTMLInputElement>(`input[name='${filterName}']:checked`);
		selectedInputs.forEach((input) => (input.checked = false));
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
			document.querySelector("[data-language-submit]")?.classList.remove("hide");
			languageWrapper?.classList.add("modal-selected");
		} else {
			document.querySelector("[data-language-submit]")?.classList.add("hide");
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
}
