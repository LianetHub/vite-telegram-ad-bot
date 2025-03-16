import { EventEmitter } from "../store/EventEmitter";
import { updateCheckboxQuantity, categoriesUIUpdate, languageUIUpdate, handleSegmentedChange } from "../utils/uiActions";

export class ChangeHandler {
	constructor(private eventEmitter: EventEmitter) {
		document.addEventListener("change", this.handleChange.bind(this));
	}

	private handleChange(e: Event) {
		const target = e.target as HTMLInputElement;

		if (target.name === "category") {
			const categoriesQuantityElement = document.querySelector(".header__categories-quantity") as HTMLElement;
			if (categoriesQuantityElement) {
				updateCheckboxQuantity(categoriesQuantityElement, (count) => {
					categoriesUIUpdate(count);
					this.eventEmitter.emit("categories:change");
				});
			}
		}

		if (target.name === "language") {
			const languageQuantityElement = document.querySelector(".modal__language-quantity") as HTMLElement;
			if (languageQuantityElement) {
				updateCheckboxQuantity(languageQuantityElement, (count) => {
					languageUIUpdate(count);
					this.eventEmitter.emit("languageChanged", count);
				});
			}
		}

		if (target.classList.contains("segmented-controls__item-input")) {
			const segmentedControls = target.closest(".segmented-controls") as HTMLElement;
			handleSegmentedChange(segmentedControls, target.value);
			this.eventEmitter.emit("audienceChanged", target.value);
		}
	}
}
