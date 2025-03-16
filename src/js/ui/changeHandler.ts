import { EventEmitter } from "../store/EventEmitter";
import { updateCheckboxQuantity, categoriesUIUpdate, languageUIUpdate, handleSegmentedChange } from "../utils/uiActions";

export class ChangeHandler {
	constructor(private eventEmitter: EventEmitter) {
		document.addEventListener("change", this.handleChange.bind(this));
	}

	private handleChange(event: Event) {
		const target = event.target as HTMLInputElement;

		const filterNames = ["category", "sort", "weekly_sends", "monthly_growth", "language"];
		if (filterNames.includes(target.name)) {
			this.eventEmitter.emit("filters:change", event);
		}

		const uiUpdates: { [key: string]: { selector: string; callback: (count: number) => void } } = {
			category: {
				selector: ".header__categories-quantity",
				callback: categoriesUIUpdate,
			},
			language: {
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
