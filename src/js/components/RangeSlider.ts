export class RangeSlider {
	private rangeElement: HTMLElement;
	private leftControl: HTMLElement;
	private rightControl: HTMLElement;
	private fieldElement: HTMLElement;

	private minValue: number = 0;
	private maxValue: number = 100;
	private currentMinValue: number;
	private currentMaxValue: number;

	private isDraggingLeft: boolean = false;
	private isDraggingRight: boolean = false;

	constructor(rangeElement: HTMLElement) {
		this.rangeElement = rangeElement;

		const startValue = rangeElement.getAttribute("data-start-value");
		const endValue = rangeElement.getAttribute("data-end-value");

		this.minValue = startValue ? parseInt(startValue) : this.minValue;
		this.maxValue = endValue ? parseInt(endValue) : this.maxValue;

		this.currentMinValue = this.minValue;
		this.currentMaxValue = this.maxValue;

		this.leftControl = document.createElement("div");
		this.leftControl.classList.add("range__control", "left");
		this.leftControl.style.left = `${this.calculatePercentage(this.currentMinValue)}%`;

		this.rightControl = document.createElement("div");
		this.rightControl.classList.add("range__control", "right");
		this.rightControl.style.left = `${this.calculatePercentage(this.currentMaxValue)}%`;

		this.fieldElement = document.createElement("div");
		this.fieldElement.classList.add("range__field");

		this.initialize();
	}

	private initialize() {
		this.rangeElement.appendChild(this.fieldElement);
		this.rangeElement.appendChild(this.leftControl);
		this.rangeElement.appendChild(this.rightControl);

		this.addEventListeners();
		this.updateControlsPosition();
	}

	private addEventListeners() {
		this.leftControl.addEventListener("mousedown", this.onLeftControlMouseDown);
		this.rightControl.addEventListener("mousedown", this.onRightControlMouseDown);

		this.leftControl.addEventListener("touchstart", this.onLeftControlTouchStart);
		this.rightControl.addEventListener("touchstart", this.onRightControlTouchStart);

		window.addEventListener("mousemove", this.onMouseMove);
		window.addEventListener("mouseup", this.onMouseUp);
		window.addEventListener("touchmove", this.onTouchMove);
		window.addEventListener("touchend", this.onTouchEnd);
	}

	private onLeftControlMouseDown = (event: MouseEvent) => {
		this.isDraggingLeft = true;
		event.preventDefault();
	};

	private onRightControlMouseDown = (event: MouseEvent) => {
		this.isDraggingRight = true;
		event.preventDefault();
	};

	private onLeftControlTouchStart = (event: TouchEvent) => {
		this.isDraggingLeft = true;
		event.preventDefault();
	};

	private onRightControlTouchStart = (event: TouchEvent) => {
		this.isDraggingRight = true;
		event.preventDefault();
	};

	private onMouseMove = (event: MouseEvent) => {
		if (this.isDraggingLeft || this.isDraggingRight) {
			this.updatePosition(event.clientX);
		}
	};

	private onTouchMove = (event: TouchEvent) => {
		if (this.isDraggingLeft || this.isDraggingRight) {
			const touch = event.touches[0];
			this.updatePosition(touch.clientX);
		}
	};

	private updatePosition(clientX: number) {
		const rangeRect = this.rangeElement.getBoundingClientRect();
		const offsetX = clientX - rangeRect.left;

		if (this.isDraggingLeft) {
			const newLeft = Math.min(offsetX, this.rightControl.offsetLeft);
			this.currentMinValue = this.calculateValue(Math.max(newLeft, 0));
		}

		if (this.isDraggingRight) {
			const newRight = Math.max(offsetX, this.leftControl.offsetLeft);
			this.currentMaxValue = this.calculateValue(Math.min(newRight, this.rangeElement.offsetWidth));
		}

		this.updateControlsPosition();
	}

	private onMouseUp = () => {
		this.isDraggingLeft = false;
		this.isDraggingRight = false;
	};

	private onTouchEnd = () => {
		this.isDraggingLeft = false;
		this.isDraggingRight = false;
	};

	private updateControlsPosition() {
		const leftPercentage = this.calculatePercentage(this.currentMinValue);
		const rightPercentage = this.calculatePercentage(this.currentMaxValue);

		const fieldWidth = Math.min(100, rightPercentage - leftPercentage);
		this.fieldElement.style.width = `${fieldWidth}%`;

		this.leftControl.style.left = `${leftPercentage}%`;
		this.rightControl.style.left = `${rightPercentage}%`;

		this.fieldElement.style.left = `${leftPercentage}%`;

		this.rangeElement.setAttribute("data-start-value", `${this.currentMinValue}`);
		this.rangeElement.setAttribute("data-end-value", `${this.currentMaxValue}`);
	}

	private calculatePercentage(value: number): number {
		return ((value - this.minValue) / (this.maxValue - this.minValue)) * 100;
	}

	private calculateValue(offset: number): number {
		const rangeWidth = this.rangeElement.offsetWidth;
		return Math.round((offset / rangeWidth) * (this.maxValue - this.minValue) + this.minValue);
	}
}
