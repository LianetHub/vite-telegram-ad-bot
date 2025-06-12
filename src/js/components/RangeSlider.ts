import noUiSlider, { API } from "nouislider";
import { addThousandSeparator } from "../utils/addThousandSeparator";
import debounce from "lodash.debounce";
import "nouislider/dist/nouislider.css";

export class RangeSlider {
    private rangeElement: HTMLElement;
    private minInput: HTMLInputElement;
    private maxInput: HTMLInputElement;
    private slider: API;
    private isReseting: boolean;
    private isPreventingChange: boolean;
    private isDragging: boolean;
    private activeHandle: number | null; // 0 для min, 1 для max

    constructor(rangeElement: HTMLElement, minInput: HTMLInputElement, maxInput: HTMLInputElement) {
        this.rangeElement = rangeElement;
        this.minInput = minInput;
        this.maxInput = maxInput;

        const startValue = parseInt(minInput?.value.replace(/\s/g, "")) || 0;
        const endValue = parseInt(maxInput?.value.replace(/\s/g, "")) || 100;

        this.isReseting = false;
        this.isPreventingChange = false;
        this.isDragging = false;
        this.activeHandle = null;

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
        this.slider.on(
            "set",
            debounce((_, handleNumber) => {
                if (this.isReseting || this.isPreventingChange) return;

                const event = new Event("change", { bubbles: true, cancelable: true });
                if (handleNumber === 0) {
                    this.minInput.dispatchEvent(event);
                }
                if (handleNumber === 1) {
                    this.maxInput.dispatchEvent(event);
                }
            }, 300)
        );

        this.minInput.addEventListener("blur", () => this.validateAndSetInput(this.minInput));
        this.maxInput.addEventListener("blur", () => this.validateAndSetInput(this.maxInput));

        this.minInput.addEventListener("keydown", this.handleKeyDown);
        this.maxInput.addEventListener("keydown", this.handleKeyDown);

        [this.minInput, this.maxInput].forEach((input) => {
            input.addEventListener("reset", () => {
                this.isReseting = true;

                this.rangeElement.classList.add("no-transition");
                this.slider.reset();

                setTimeout(() => {
                    this.isReseting = false;
                    this.rangeElement.classList.remove("no-transition");
                }, 500);
            });
        });

        this.minInput.addEventListener("input", this.onInputValidation);
        this.maxInput.addEventListener("input", this.onInputValidation);

        this.addCurrencyUnit(this.minInput);
        this.addCurrencyUnit(this.maxInput);

        this.waitForVisibleAndUpdate(this.minInput);
        this.waitForVisibleAndUpdate(this.maxInput);

        // Добавляем обработчики для кастомного перетаскивания
        this.rangeElement.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    private handleMouseDown = (event: MouseEvent): void => {
        // Проверяем, что клик произошёл на области .noUi-connect
        const connectElement = this.rangeElement.querySelector(".noUi-connect");
        if (!connectElement || !connectElement.contains(event.target as Node)) return;

        // Предотвращаем стандартное поведение noUiSlider
        event.preventDefault();
        event.stopPropagation();

        const values = this.slider.get() as [number, number];
        const sliderRect = this.rangeElement.getBoundingClientRect();
        const clickPosition = (event.clientX - sliderRect.left) / sliderRect.width;
        const range = this.slider.options.range as { min: number; max: number };
        const clickValue = range.min + clickPosition * (range.max - range.min);

        // Определяем ближайший ползунок
        const minDistance = Math.abs(clickValue - values[0]);
        const maxDistance = Math.abs(clickValue - values[1]);
        this.activeHandle = minDistance <= maxDistance ? 0 : 1;

        this.isDragging = true;
        this.handleMouseMove(event); // Начинаем движение сразу
    };

    private handleMouseMove = (event: MouseEvent): void => {
        if (!this.isDragging || this.activeHandle === null) return;

        const sliderRect = this.rangeElement.getBoundingClientRect();
        // Нормализуем позицию курсора (0 до 1)
        let position = (event.clientX - sliderRect.left) / sliderRect.width;
        position = Math.max(0, Math.min(1, position)); // Ограничиваем 0-1

        const range = this.slider.options.range as { min: number; max: number };
        const newValue = Math.round(range.min + position * (range.max - range.min));

        // Ограничиваем значение в пределах диапазона и соседнего ползунка
        const currentValues = this.slider.get() as [number, number];
        if (this.activeHandle === 0) {
            const maxAllowed = Math.min(newValue, currentValues[1] - 1); // Не даём пересекать max
            this.slider.set([Math.max(range.min, maxAllowed), null]);
        } else {
            const minAllowed = Math.max(newValue, currentValues[0] + 1); // Не даём пересекать min
            this.slider.set([null, Math.min(range.max, minAllowed)]);
        }
    };

    private handleMouseUp = (): void => {
        if (this.isDragging && this.activeHandle !== null) {
            this.isDragging = false;
            this.activeHandle = null;
        }
    };

    private onSliderUpdate = (values: (string | number)[]) => {
        this.minInput.value = String(values[0]);
        this.maxInput.value = String(values[1]);

        this.updateUnitPosition(this.minInput);
        this.updateUnitPosition(this.maxInput);
    };

    public onInputChange(prevetingChange: boolean = false): void {
        this.isPreventingChange = prevetingChange;

        const minValue = parseInt(this.minInput.value.replace(/\s/g, "")) || 0;
        const maxValue = parseInt(this.maxInput.value.replace(/\s/g, "")) || 100;
        this.slider.set([minValue, maxValue]);

        setTimeout(() => {
            this.isPreventingChange = false;
        }, 300);

        this.updateUnitPosition(this.minInput);
        this.updateUnitPosition(this.maxInput);
    }

    private onInputValidation = (event: Event) => {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, "");

        if (value.length > 8) {
            value = value.slice(0, 8);
        }

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

            this.updateUnitPosition(input);
        }
    }

    private getTextWidth(text: string, input: HTMLInputElement): number {
        const span = document.createElement("span");
        span.style.visibility = "hidden";
        span.style.whiteSpace = "nowrap";
        span.style.font = window.getComputedStyle(input).font;
        span.textContent = `\u202F` + text;
        document.body.appendChild(span);
        const textWidth = span.offsetWidth;
        document.body.removeChild(span);

        return textWidth;
    }

    private updateUnitPosition(input: HTMLInputElement) {
        const textWidth = this.getTextWidth(input.value, input);
        const paddingLeft = parseFloat(window.getComputedStyle(input).paddingLeft);
        const paddingRight = parseFloat(window.getComputedStyle(input).paddingRight) / 2;
        const inputWidth = input.clientWidth;
        const unit = input.parentNode?.querySelector(".form__control-unit") as HTMLElement;

        if (unit) {
            const unitWidth = unit.offsetWidth;
            const maxLeft = inputWidth - unitWidth - paddingRight;
            const newLeft = Math.min(textWidth + paddingLeft, maxLeft);

            requestAnimationFrame(() => {
                unit.style.left = `${newLeft}px`;
            });
        }
    }

    private waitForVisibleAndUpdate(input: HTMLInputElement) {
        const checkVisible = () => {
            if (input.offsetParent !== null) {
                this.updateUnitPosition(input);
            } else {
                requestAnimationFrame(checkVisible);
            }
        };

        checkVisible();
    }

    private validateAndSetInput(input: HTMLInputElement): void {
        const isMin = input === this.minInput;
        const otherInput = isMin ? this.maxInput : this.minInput;

        const inputValue = parseInt(input.value.replace(/\s/g, "")) || 0;
        const otherValue = parseInt(otherInput.value.replace(/\s/g, "")) || 0;
        const range = this.slider.options.range as { min: number; max: number };

        let validValue = inputValue;

        if (isMin) {
            if (inputValue < range.min || inputValue > otherValue) {
                validValue = range.min;
            }
        } else {
            if (inputValue < otherValue || inputValue > range.max) {
                validValue = range.max;
            }
        }

        if (validValue !== inputValue) {
            this.slider.set(isMin ? [validValue, null] : [null, validValue]);

            input.value = addThousandSeparator(validValue);

            input.blur();
        }

        this.updateUnitPosition(input);
    }

    private handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
            if (event.target === this.minInput) {
                this.validateAndSetInput(this.minInput);
            }
            if (event.target === this.maxInput) {
                this.validateAndSetInput(this.maxInput);
            }
        }
    };

    public resetSlider(newStartValue: number, newEndValue: number, currentMinValue: number, currentMaxValue: number): void {
        this.minInput.value = addThousandSeparator(currentMinValue);
        this.maxInput.value = addThousandSeparator(currentMaxValue);

        this.slider.updateOptions(
            {
                start: [currentMinValue, currentMaxValue],
                range: {
                    min: newStartValue,
                    max: newEndValue,
                },
            },
            false
        );

        const event = new Event("change", { bubbles: true, cancelable: true });
        this.minInput.dispatchEvent(event);
        this.maxInput.dispatchEvent(event);

        this.updateUnitPosition(this.minInput);
        this.updateUnitPosition(this.maxInput);
    }
}