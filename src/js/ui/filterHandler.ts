import { store } from "../store/store";
import { Category, SortBy, WeeklySends, MonthlyGrowth, LanguageCode, PriceType, SearchRequest } from "../api/types";

export class FilterHandler {
	public handleFilterChanged(event: Event) {
		const target = event.target as HTMLInputElement;
		const filterName = target.name as keyof SearchRequest;

		const filterValue = this.getFilterValue(filterName);

		store.setFilters({ [filterName]: filterValue });
		store.fetchCards();
		this.toggleResetFilterBtn();
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
		]
	) {
		console.log("Сброс фильтров: ", filterNames);
		filterNames.forEach((filterName) => this.resetFilter(filterName));

		store.setFilters(Object.fromEntries(filterNames.map((name) => [name, undefined])));
		store.fetchCards();
		this.toggleResetFilterBtn();
	}

	private resetFilter(filterName: string) {
		const selectedInputs = document.querySelectorAll<HTMLInputElement>(`input[name='${filterName}']:checked`);
		selectedInputs.forEach((input) => (input.checked = false));
	}

	private getFilterValue(filterName: string): string | number | boolean | undefined {
		switch (filterName) {
			case "categories":
				return this.getSelectedString<Category>(filterName);
			case "sort":
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

	private getSelectedBoolean(name: string): boolean {
		const input = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
		return input?.checked ?? false;
	}

	private getSelectedFilter<T>(filterName: string): T | undefined {
		const selectedInput = document.querySelector<HTMLInputElement>(`input[name='${filterName}']:checked`);
		return selectedInput ? (selectedInput.value as T) : undefined;
	}

	private toggleResetFilterBtn() {
		const resetFilterBtn = document.querySelector<HTMLElement>("[data-reset-filter]");
		const isAnyFilterSelected = ["sort", "weekly_sends", "monthly_growth"].some(this.isFilterSelected);

		if (resetFilterBtn) {
			resetFilterBtn.classList.toggle("hide", !isAnyFilterSelected);
		}
	}

	private isFilterSelected = (filterName: string): boolean => {
		return document.querySelector(`input[name='${filterName}']:checked`) !== null;
	};
}
