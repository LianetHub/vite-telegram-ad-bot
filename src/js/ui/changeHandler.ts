import { EventEmitter } from "../store/EventEmitter";
import { updateCheckboxQuantity, categoriesUIUpdate, languageUIUpdate, handleSegmentedChange } from "../utils/uiActions";

export class ChangeHandler {
	constructor(private eventEmitter: EventEmitter) {
		document.addEventListener("change", this.handleChange.bind(this));
	}

	private handleChange(event: Event) {
		const target = event.target as HTMLInputElement;

		const filterNames = ["categories", "sort_by", "weekly_sends", "monthly_growth", "languages", "premium", "price_type", "price_min", "price_max"];
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
			this.eventEmitter.emit("audienceChanged", target.value);
		}
	}
}
