import { Modal } from "../../components/Modal";
import { EventEmitter } from "../../store/EventEmitter";
import { store } from "../../store/store";
import { removeLoading } from "../../utils/buttonLoadingUtils";

export class SortFilterHandler {
	constructor(private eventEmitter: EventEmitter, private modal: Modal) {
		this.initEventListeners();
	}

	private initEventListeners() {
		document.addEventListener("click", this.handleClick.bind(this));
	}

	private handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target) return;

		const completFiltersBtn = target.closest("[data-filter-complete]") as HTMLButtonElement | null;
		if (completFiltersBtn) {
			this.modal.closeModal();
			this.eventEmitter.emit("filters:complete");
			this.updateFilterToggler();
		}

		const resetFilterBtn = target.closest("[data-reset-filter]") as HTMLElement | null;
		if (resetFilterBtn) {
			this.eventEmitter.emit("filters:reset");
		}
	}

	public checkFilterSelection(filterNames: string | string[]): void {
		const isActive = this.isAnyFilterSelected(filterNames);
		this.updateFilterUIState(isActive);
	}

	private updateFilterUIState(isActive: boolean): void {
		const filterWrapper = document.querySelector<HTMLElement>(".filter");
		filterWrapper?.classList.toggle("modal-selected", isActive);
	}

	private updateFilterToggler() {
		const isActive = this.isAnyFilterSelected(["sort_by", "weekly_sends", "monthly_growth"]);
		const filterToggler = document.querySelector<HTMLButtonElement>(".header__filter-btn");
		filterToggler?.classList.toggle("active", isActive);
	}

	private isAnyFilterSelected(filterNames: string | string[]): boolean {
		const filters = Array.isArray(filterNames) ? filterNames : [filterNames];

		return filters.some((filterName) => {
			const inputs = document.querySelectorAll<HTMLInputElement>(`input[name='${filterName}']`);
			return Array.from(inputs).some((input) => {
				if (input.type === "hidden") {
					return input.value.trim() !== "";
				} else if (input.type === "radio") {
					return input.checked !== input.defaultChecked;
				} else {
					return input.checked;
				}
			});
		});
	}

	public updateSelectionItems(): void {
		const state = store.getState();
		const filters = state.filters;

		if (!filters) return;

		const targetFilters = ["sort_by", "weekly_sends", "monthly_growth"] as const;

		targetFilters.forEach((filterName) => {
			const filterValue = filters[filterName];
			if (filterValue === undefined) return;

			const inputs = document.querySelectorAll<HTMLInputElement>(`input[name="${filterName}"]`);

			inputs.forEach((input) => {
				if (input.type === "checkbox" || input.type === "radio") {
					input.checked = false;
				} else {
					input.value = "";
				}

				if (input.type === "checkbox") {
					if (Array.isArray(filterValue)) {
						input.checked = filterValue.includes(input.value);
					} else {
						input.checked = input.value === filterValue;
					}
				} else if (input.type === "radio") {
					input.checked = input.value === filterValue;
				} else {
					input.value = filterValue;
				}
			});
		});
	}

	public updateFilterButtonText(type: "бот" = "бот"): void {
		const filterCompleteBtn = document.querySelector("[data-filter-complete]") as HTMLButtonElement;

		const state = store.getState();
		const quantity = state.cards.length;
		const filters = state.filters;

		const isWeeklyOrGrowthSelected = filters?.weekly_sends !== undefined || filters?.monthly_growth !== undefined;

		const getDeclension = (num: number, word: string): string => {
			if (num % 10 === 1 && num % 100 !== 11) return `${word}а`;
			if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return `${word}а`;
			return `${word}ов`;
		};

		let priceSpan = filterCompleteBtn.querySelector(".complete-btn__price");
		if (priceSpan) priceSpan.remove();

		let text: string;

		if (isWeeklyOrGrowthSelected) {
			if (quantity === 0) {
				text = "Показать 0 ботов";
			} else {
				text = `Показать ${quantity} ${getDeclension(quantity, type)}`;
			}
		} else {
			text = "Применить";
		}

		filterCompleteBtn.textContent = "";
		priceSpan = document.createElement("span");
		priceSpan.className = "complete-btn__price";
		priceSpan.textContent = text;
		filterCompleteBtn.appendChild(priceSpan);

		removeLoading(filterCompleteBtn);
	}
}
