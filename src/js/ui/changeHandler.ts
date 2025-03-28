import { EventEmitter } from "../store/EventEmitter";
import { updateCheckboxQuantity, categoriesUIUpdate, languageUIUpdate, handleSegmentedChange, toggleResetFilterBtn } from "../utils/uiActions";

export class ChangeHandler {
	constructor(private eventEmitter: EventEmitter) {
		document.addEventListener("change", this.handleChange.bind(this));
	}

	private handleChange(event: Event) {
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
				callback: categoriesUIUpdate,
			},
			languages: {
				selector: ".modal__language-quantity",
				callback: languageUIUpdate,
			},
		};

		if (uiUpdates[target.name]) {
			const { selector, callback } = uiUpdates[target.name];
			const quantityElement = document.querySelector(selector) as HTMLElement;
			if (quantityElement) {
				updateCheckboxQuantity(quantityElement, (count) => callback(count));
			}
		}

		if (target.classList.contains("segmented-controls__item-input")) {
			const segmentedControls = target.closest(".segmented-controls") as HTMLElement;
			handleSegmentedChange(segmentedControls, target.value);
		}

		if (target.classList.contains("modal__type-input")) {
			this.eventEmitter.emit("change-datepicker-type", event);
		}

		if (["sort_by", "weekly_sends", "monthly_growth"].includes(target.name)) {
			toggleResetFilterBtn([target.name]);
		}
	}
}
