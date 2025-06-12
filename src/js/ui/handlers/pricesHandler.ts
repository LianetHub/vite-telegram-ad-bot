import { Modal } from "../../components/Modal";
import { EventEmitter } from "../../store/EventEmitter";
import { store } from "../../store/store";
import { removeLoading } from "../../utils/buttonLoadingUtils";
import { formatNumber } from "../../utils/formatNumber";
import { RangeSlider } from "../../components/RangeSlider";

export class PricesFilterHandler {
	private priceRangeSlider: RangeSlider | null = null;

	constructor(private eventEmitter: EventEmitter, private modal: Modal) {
		this.initEventListeners();
	}

	public initPriceRangeSlider() {
		const rangePrice = document.querySelector("#range-price") as HTMLElement;
		const rangePriceMinInput = document.querySelector("#start-price-input") as HTMLInputElement;
		const rangePriceMaxInput = document.querySelector("#end-price-input") as HTMLInputElement;

		if (this.priceRangeSlider) {
			const { price_min, price_max } = store.getState().filters;

			const minValue = parseInt(rangePriceMinInput.defaultValue.replace(/\s/g, ""));
			const maxValue = parseInt(rangePriceMaxInput.defaultValue.replace(/\s/g, ""));
			const currentMinValue = typeof price_min === "number" ? price_min : minValue;
			const currentMaxValue = typeof price_max === "number" ? price_max : maxValue;
			this.priceRangeSlider.resetSlider(minValue, maxValue, currentMinValue, currentMaxValue);
			return;
		}

		if (rangePrice && rangePriceMinInput && rangePriceMaxInput) {
			this.priceRangeSlider = new RangeSlider(rangePrice, rangePriceMinInput, rangePriceMaxInput);
		}
	}

	private initEventListeners() {
		document.addEventListener("click", this.handleClick.bind(this));
	}

	private handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target) return;

		const completePricesBtn = target.closest("[data-prices-complete]") as HTMLButtonElement | null;
		if (completePricesBtn) {
			const resetPricesBtn = document.querySelector("[data-prices-reset]") as HTMLButtonElement;

			if (!this.hasPriceFiltersChanged()) {
				this.modal.closeModal();
				if (this.isStoreFiltersChangedFromDefault()) {
					this.eventEmitter.emit("filters:prices-reset", true);
					this.removeTogglerState();
					resetPricesBtn.classList.remove("hidden");
				}

				return;
			}

			this.modal.closeModal();
			this.updatePriceUI();
			this.eventEmitter.emit("filters:complete");

			setTimeout(() => {
				resetPricesBtn.classList.remove("hidden");
			}, 200);
		}

		const resetPricesBtn = target.closest("[data-prices-reset]") as HTMLButtonElement | null;
		if (resetPricesBtn) {
			this.removeTogglerState();
			this.eventEmitter.emit("filters:prices-reset", true);
			this.modal.closeModal();
		}

		const btnResetSort = target.closest(".btn__reset") as HTMLElement | null;
		if (btnResetSort) {
			let btnWrapper = btnResetSort?.closest(".header__sort-btn");

			if (btnWrapper?.getAttribute("href") === "#select-price") {
				this.removeTogglerState();
				this.eventEmitter.emit("filters:prices-reset", true);
			}
		}
	}

	public updatePriceUI(forceSyncWithStore: boolean = false) {
		const btn = document.querySelector("[data-prices-toggler]");
		const btnWrapperText = btn?.querySelector(".btn__value") as HTMLElement;
		const hint = btn?.querySelector(".btn__hint") as HTMLElement;
		const rangePriceMinInput = document.querySelector("#start-price-input") as HTMLInputElement | null;
		const rangePriceMaxInput = document.querySelector("#end-price-input") as HTMLInputElement | null;
		const priceTypeInputs = document.querySelectorAll<HTMLInputElement>('[name="price_type"]');

		const { price_min, price_max, price_type } = store.getState().filters;

		if (forceSyncWithStore) {
			if (rangePriceMinInput) {
				rangePriceMinInput.value = price_min !== undefined ? String(price_min) : rangePriceMinInput.defaultValue;
			}
			if (rangePriceMaxInput) {
				rangePriceMaxInput.value = price_max !== undefined ? String(price_max) : rangePriceMaxInput.defaultValue;
			}
			priceTypeInputs.forEach((input) => {
				if (input.defaultChecked) {
					input.click();
				}
			});

			this.priceRangeSlider?.onInputChange(true);
		}

		if (hint) {
			if (price_type === "per_100k") {
				hint.classList.remove("hidden");
				if (price_min === undefined && price_max === undefined) {
					btnWrapperText.classList.add("hidden");
				} else {
					btnWrapperText.classList.remove("hidden");
				}
			} else {
				hint.classList.add("hidden");
			}
		}

		if (price_min !== undefined || price_max !== undefined || price_type == "per_100k") {
			btn?.classList.add("selected");
		}

		if (price_min !== undefined && price_max !== undefined) {
			const formattedMin = formatNumber(price_min);
			const formattedMax = formatNumber(price_max);

			btnWrapperText.textContent = `${formattedMin}\u202F–\u202F${formattedMax}\u202F₽`;
		} else if (price_min === undefined && price_max !== undefined) {
			const formattedMax = formatNumber(price_max);

			btnWrapperText.textContent = `до ${formattedMax}\u202F₽`;
		} else if (price_min !== undefined && price_max === undefined) {
			const formattedMin = formatNumber(price_min);
			const formattedMax = formatNumber(Number(rangePriceMaxInput?.defaultValue ?? NaN));
			btnWrapperText.textContent = `${formattedMin}\u202F–\u202F${formattedMax}\u202F₽`;
		}
	}

	public removeTogglerState() {
		const btnToggler = document.querySelector("[data-prices-toggler]") as HTMLElement;
		btnToggler?.classList.remove("selected");
		const btnHint = btnToggler?.querySelector(".btn__hint") as HTMLElement;
		const btnWrapperText = btnToggler?.querySelector(".btn__value") as HTMLElement;
		btnHint.classList.add("hidden");
		btnWrapperText.classList.remove("hidden");
		btnWrapperText.textContent = "Цена";
	}

	public updatePricesButtonText(type: "бот" = "бот") {
		const completePricesBtn = document.querySelector("[data-prices-complete]") as HTMLButtonElement;

		const state = store.getState();
		const quantity = state.cards.length;
		const filters = state.filters;

		const isAllFiltersUndefined = filters && typeof filters === "object" ? Object.values(filters).every((value) => value === undefined) : false;

		const getDeclension = (num: number, word: string): string => {
			if (num % 10 === 1 && num % 100 !== 11) return `${word}а`;
			if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return `${word}а`;
			return `${word}ов`;
		};

		let priceSpan = completePricesBtn.querySelector(".complete-btn__price");
		if (priceSpan) priceSpan.remove();

		if (quantity > 0) {
			let text: string;

			if (isAllFiltersUndefined || !this.hasPriceFiltersChanged()) {
				text = "Показать все";
			} else {
				text = `Показать ${quantity} ${getDeclension(quantity, type)}`;
			}

			completePricesBtn.textContent = "";
			priceSpan = document.createElement("span");
			priceSpan.className = "complete-btn__price";
			priceSpan.textContent = text;
			completePricesBtn.appendChild(priceSpan);
		} else {
			completePricesBtn.textContent = "Показать 0 ботов";
		}

		removeLoading(completePricesBtn);
	}

	private hasPriceFiltersChanged(): boolean {
		const priceMinInput = document.querySelector<HTMLInputElement>("input[name='price_min']");
		const priceMaxInput = document.querySelector<HTMLInputElement>("input[name='price_max']");

		const normalize = (value: string) => value.replace(/[^\d]/g, "");

		const priceMinChanged = priceMinInput && normalize(priceMinInput.value) !== normalize(priceMinInput.defaultValue);
		const priceMaxChanged = priceMaxInput && normalize(priceMaxInput.value) !== normalize(priceMaxInput.defaultValue);

		const priceTypeInputs = document.querySelectorAll<HTMLInputElement>("input[name='price_type']");
		const priceTypeChanged = Array.from(priceTypeInputs).some((input) => input.checked !== input.defaultChecked);

		return priceMinChanged || priceMaxChanged || priceTypeChanged;
	}

	private isStoreFiltersChangedFromDefault(): boolean {
		const state = store.getState();

		if (!state.tempFilters) return true;

		const { price_min, price_max, price_type } = state.tempFilters;

		const priceMinInput = document.querySelector<HTMLInputElement>("input[name='price_min']");
		const priceMaxInput = document.querySelector<HTMLInputElement>("input[name='price_max']");
		const priceTypeInputs = document.querySelectorAll<HTMLInputElement>("input[name='price_type']");

		const normalize = (value: string) => value.replace(/[^\d]/g, "");
		const defaultMin = priceMinInput ? parseInt(normalize(priceMinInput.defaultValue)) : undefined;
		const defaultMax = priceMaxInput ? parseInt(normalize(priceMaxInput.defaultValue)) : undefined;
		const defaultPriceType = Array.from(priceTypeInputs).find((input) => input.defaultChecked)?.value;

		const isMinChanged = price_min !== undefined && price_min !== defaultMin;
		const isMaxChanged = price_max !== undefined && price_max !== defaultMax;
		const isTypeChanged = price_type !== undefined && price_type !== defaultPriceType;

		return isMinChanged || isMaxChanged || isTypeChanged;
	}
}
