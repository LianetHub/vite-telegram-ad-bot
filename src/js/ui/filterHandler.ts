import { store } from "../store/store";
import { Category, SortBy, WeeklySends, MonthlyGrowth } from "../api/types";

export class FilterHandler {
	public handleFilterChanged(event: Event) {
		const target = event.target as HTMLInputElement;
		const filterName = target.name;

		let filterValue: string | number | undefined;

		switch (filterName) {
			case "category":
				filterValue = this.getSelectedCategories();
				break;
			case "sort":
				filterValue = this.getSelectedFilter<SortBy>("sort");
				break;
			case "weekly_sends":
				filterValue = this.getSelectedFilter<WeeklySends>("weekly_sends");
				break;
			case "monthly_growth":
				filterValue = this.getSelectedFilter<MonthlyGrowth>("monthly_growth");
				break;
		}

		store.setFilters({
			[filterName]: filterValue,
		});

		store.fetchCards();
		this.toggleResetFilterBtn();
	}

	public resetFilters() {
		console.log("Сброс фильтров");

		const resetFilterNames = ["sort", "weekly_sends", "monthly_growth"];

		resetFilterNames.forEach((filterName) => {
			const input = document.querySelector(`input[name='${filterName}']:checked`) as HTMLInputElement;
			if (input) {
				input.checked = false;
			}
		});

		store.setFilters({
			sort_by: undefined,
			weekly_sends: undefined,
			monthly_growth: undefined,
		});

		store.fetchCards();
		this.toggleResetFilterBtn();
	}

	private getSelectedCategories(): string {
		return Array.from(document.querySelectorAll("input[name='category']:checked"))
			.map((input) => (input as HTMLInputElement).value as Category)
			.join(",");
	}

	private getSelectedFilter<T>(filterName: string): T | undefined {
		const selectedInput = document.querySelector(`input[name='${filterName}']:checked`) as HTMLInputElement;
		return selectedInput ? (selectedInput.value as T) : undefined;
	}

	private toggleResetFilterBtn() {
		const resetFilterBtn = document.querySelector("[data-reset-filter]") as HTMLElement;

		const isAnyFilterSelected = this.isFilterSelected("sort") || this.isFilterSelected("weekly_sends") || this.isFilterSelected("monthly_growth");

		if (resetFilterBtn) {
			if (isAnyFilterSelected) {
				resetFilterBtn.classList.remove("hide");
			} else {
				resetFilterBtn.classList.add("hide");
			}
		}
	}

	private isFilterSelected(filterName: string): boolean {
		const input = document.querySelector(`input[name='${filterName}']:checked`) as HTMLInputElement;
		return input !== null;
	}
}
