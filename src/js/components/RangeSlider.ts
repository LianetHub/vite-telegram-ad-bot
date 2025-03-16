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

		this.minInput.addEventListener("change", this.onInputChange);
		this.maxInput.addEventListener("change", this.onInputChange);

		this.minInput.addEventListener("input", this.onInputValidation);
		this.maxInput.addEventListener("input", this.onInputValidation);
	}

	private onSliderUpdate = (values: (string | number)[]) => {
		this.minInput.value = String(values[0]);
		this.maxInput.value = String(values[1]);
	};

	private onInputChange = () => {
		const minValue = parseInt(this.minInput.value.replace(/\s/g, "")) || 0;
		const maxValue = parseInt(this.maxInput.value.replace(/\s/g, "")) || 100;
		this.slider.set([minValue, maxValue]);
	};

	private onInputValidation = (event: Event) => {
		const input = event.target as HTMLInputElement;

		let value = input.value.replace(/\D/g, "");

		if (value === "") {
			value = "0";
		}
		let numericValue = parseInt(value, 10);
		input.value = addThousandSeparator(numericValue);
	};
}
