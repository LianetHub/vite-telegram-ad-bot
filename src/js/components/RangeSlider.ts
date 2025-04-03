import noUiSlider, { API } from "nouislider";
import { addThousandSeparator } from "../utils/addThousandSeparator";
import "nouislider/dist/nouislider.css";

export class RangeSlider {
	private rangeElement: HTMLElement;
	private minInput: HTMLInputElement;
	private maxInput: HTMLInputElement;
	private slider: API;

	constructor(rangeElement: HTMLElement, minInput: HTMLInputElement, maxInput: HTMLInputElement) {
		this.rangeElement = rangeElement;
		this.minInput = minInput;
		this.maxInput = maxInput;

		const startValue = parseInt(minInput?.value.replace(/\s/g, "")) || 0;
		const endValue = parseInt(maxInput?.value.replace(/\s/g, "")) || 100;

		this.slider = noUiSlider.create(this.rangeElement, {
			start: [startValue, endValue],
			connect: true,
			range: {
				min: startValue,
				max: endValue,
			},
			format: {
				to: (value: number) => addThousandSeparator(Math.round(value)),
				from: (value: string) => parseInt(value.replace(/\s/g, "")) || 0,
			},
		});

		this.slider.on("update", this.onSliderUpdate);
		this.slider.on("set", () => {
			const event = new Event("change", { bubbles: true, cancelable: true });
			this.minInput.dispatchEvent(event);
			this.maxInput.dispatchEvent(event);
		});

		this.minInput.addEventListener("blur", this.onInputChange);
		this.maxInput.addEventListener("blur", this.onInputChange);

		this.minInput.addEventListener("reset", () => this.slider.reset());
		this.maxInput.addEventListener("reset", () => this.slider.reset());

		this.minInput.addEventListener("input", this.onInputValidation);
		this.maxInput.addEventListener("input", this.onInputValidation);

		this.addCurrencyUnit(this.minInput);
		this.addCurrencyUnit(this.maxInput);
	}

	private onSliderUpdate = (values: (string | number)[]) => {
		this.minInput.value = String(values[0]);
		this.maxInput.value = String(values[1]);

		this.updateUnitPosition(this.minInput);
		this.updateUnitPosition(this.maxInput);
	};

	private onInputChange = () => {
		const minValue = parseInt(this.minInput.value.replace(/\s/g, "")) || 0;
		const maxValue = parseInt(this.maxInput.value.replace(/\s/g, "")) || 100;
		this.slider.set([minValue, maxValue]);

		this.updateUnitPosition(this.minInput);
		this.updateUnitPosition(this.maxInput);
	};

	private onInputValidation = (event: Event) => {
		const input = event.target as HTMLInputElement;

		let value = input.value.replace(/\D/g, "");

		if (value === "") {
			value = "0";
		}
		let numericValue = parseInt(value, 10);
		input.value = addThousandSeparator(numericValue);

		this.updateUnitPosition(input);
	};

	private addCurrencyUnit(input: HTMLInputElement) {
		const unitData = input.getAttribute("data-unit");

		if (unitData) {
			const unit = document.createElement("span");
			unit.classList.add("form__control-unit");
			unit.textContent = unitData;
			input.parentNode?.appendChild(unit);

			setTimeout(() => {
				this.updateUnitPosition(input);
			}, 0);
		}
	}

	private getTextWidth(text: string, input: HTMLInputElement): number {
		const span = document.createElement("span");
		span.style.visibility = "hidden";
		span.style.whiteSpace = "nowrap";
		span.style.font = window.getComputedStyle(input).font;
		span.textContent = text;
		document.body.appendChild(span);
		const textWidth = span.offsetWidth;
		document.body.removeChild(span);

		return textWidth;
	}

	private updateUnitPosition(input: HTMLInputElement) {
		const textWidth = this.getTextWidth(input.value, input);

		const paddingLeft = parseFloat(window.getComputedStyle(input).paddingLeft);

		const unit = input.parentNode?.querySelector(".form__control-unit") as HTMLElement;

		if (unit) {
			const remUnit = 16;
			unit.style.left = `${(textWidth + paddingLeft + 2) / remUnit}rem`;
		}
	}
}
