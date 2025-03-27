import moment from "moment";
// @ts-ignore
import "moment/dist/locale/ru";
moment.locale("ru");

import "../../scss/_datepicker.scss";

export interface CalendarOptions {
	monthsToRender?: number;
	onDateChange?: (selectedDate: string[] | undefined) => void;
	onDateSubmit?: (selectedDate: string[] | undefined) => void;
	mode?: "single" | "range";
}

export interface HTMLElementWithDatepicker extends HTMLElement {
	datepicker: Calendar;
}

export class Calendar {
	public container: HTMLElement;
	public options: CalendarOptions;
	private wrapper: HTMLElementWithDatepicker | null;
	private monthsToRender: number;
	private selectedDate: string[] | undefined = undefined;
	private resetBtn: HTMLElement | null = null;
	private submitBtn: HTMLElement | null = null;
	public mode: "single" | "range";
	private rangeStart: HTMLElement | null = null;
	private rangeEnd: HTMLElement | null = null;
	public onDateChange: (selectedDate: string[] | undefined) => void;
	public onDateSubmit: (selectedDate: string[] | undefined) => void;

	constructor(container: HTMLElement, options: CalendarOptions = {}) {
		this.container = container;
		this.options = options;
		this.wrapper = container.closest(".calendar");
		this.monthsToRender = options.monthsToRender || 24;
		this.onDateChange = options.onDateChange || (() => {});
		this.onDateSubmit = options.onDateSubmit || (() => {});
		this.mode = options.mode || "single";
		this.resetBtn = this.wrapper?.querySelector("[data-reset-calendar]") || null;
		this.submitBtn = this.wrapper?.querySelector("[data-calendar-submit]") || null;

		if (this.wrapper) {
			this.wrapper.datepicker = this;
		}

		this.renderCalendar();
	}

	private renderCalendar() {
		this.container.innerHTML = "";
		let currentMonth = moment();

		for (let i = 0; i < this.monthsToRender; i++) {
			const monthContainer = this.createMonth(currentMonth);
			this.container.appendChild(monthContainer);
			currentMonth.add(1, "month");
		}

		this.addEventListeners();
	}

	private createMonth(month: moment.Moment): HTMLElement {
		const monthBlock = document.createElement("div");
		monthBlock.classList.add("calendar__block");

		const monthName = document.createElement("div");
		monthName.classList.add("calendar__month");
		if (month.isSame(moment(), "year")) {
			monthName.textContent = month.format("MMMM");
		} else {
			monthName.textContent = month.format("MMMM YYYY");
		}
		monthBlock.appendChild(monthName);

		const monthBody = document.createElement("div");
		monthBody.classList.add("calendar__body");

		const firstDayOfMonth = month.clone().startOf("month");
		const lastDayOfMonth = month.clone().endOf("month");
		const daysInMonth = lastDayOfMonth.date();

		const emptyCells = firstDayOfMonth.isoWeekday() - 1;

		for (let i = 0; i < emptyCells; i++) {
			const emptyCell = document.createElement("div");
			emptyCell.classList.add("calendar__item");
			monthBody.appendChild(emptyCell);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const dayItem = document.createElement("div");
			dayItem.classList.add("calendar__item");

			const dayMoment = month.clone().date(day);

			if (dayMoment.isSame(moment(), "day")) {
				dayItem.classList.add("today");
			}

			if (dayMoment.isBefore(moment(), "day")) {
				dayItem.classList.add("last");
			}

			dayItem.setAttribute("data-value", dayMoment.unix().toString());

			const daySpan = document.createElement("span");
			daySpan.textContent = String(day);
			dayItem.appendChild(daySpan);

			monthBody.appendChild(dayItem);
		}

		monthBlock.appendChild(monthBody);
		return monthBlock;
	}

	private addEventListeners() {
		this.container.addEventListener("click", (event) => {
			const target = event.target as HTMLElement;
			const calendarCell = target.closest(".calendar__item") as HTMLElement;

			if (calendarCell) {
				this.selectDay(calendarCell);
			}
		});

		this.resetBtn?.addEventListener("click", () => {
			this.clearSelectedDate();
		});

		this.submitBtn?.addEventListener("click", () => {
			this.submitBtn?.classList.add("loading");
			this.onDateSubmit(this.selectedDate);
		});
	}

	private selectDay(dayElement: HTMLElement) {
		if (this.mode === "single") {
			this.clearSelectedDate();
			dayElement.classList.add("selected");
			this.selectedDate = [`${dayElement.dataset.value}`];
		} else {
			if (!this.rangeStart || this.rangeEnd) {
				this.clearSelectedDate();
				this.rangeStart = dayElement;
				this.rangeStart.classList.add("selected", "start");
				this.selectedDate = [`${this.rangeStart.dataset.value}`];
			} else {
				const clickedDate = parseInt(dayElement.dataset.value || "0", 10);
				const startDate = parseInt(this.rangeStart.dataset.value || "0", 10);

				if (clickedDate < startDate) {
					this.clearSelectedDate();
					this.rangeStart = dayElement;
					this.rangeStart.classList.add("selected", "start");
					this.selectedDate = [`${this.rangeStart.dataset.value}`];
				} else {
					this.rangeEnd = dayElement;
					this.rangeEnd.classList.add("selected", "end");
					this.updateRange();
				}
			}
		}

		this.onDateChange(this.selectedDate);
	}

	private updateRange() {
		if (!this.rangeStart || !this.rangeEnd) return;

		const startUnix = this.rangeStart.dataset.value;
		const endUnix = this.rangeEnd.dataset.value;

		this.selectedDate = [`${startUnix}-${endUnix}`];

		const allDays = this.container.querySelectorAll(".calendar__item");

		allDays.forEach((day) => {
			const dayValue = parseInt(day.getAttribute("data-value") || "0", 10);
			const startValue = parseInt(startUnix || "0", 10);
			const endValue = parseInt(endUnix || "0", 10);

			if (dayValue >= startValue && dayValue <= endValue) {
				day.classList.add("selected");
			}
		});
	}

	private clearSelectedDate() {
		this.selectedDate = undefined;
		this.rangeStart = null;
		this.rangeEnd = null;
		this.container.querySelectorAll(".calendar__item").forEach((day) => {
			day.classList.remove("selected", "start", "end");
		});
		this.onDateChange(undefined);
	}

	public getQuantitySelectedDays(): number {
		if (this.mode === "single") {
			return this.selectedDate && this.selectedDate.length > 0 ? 1 : 0;
		} else if (this.mode === "range" && this.selectedDate) {
			if (this.rangeStart && this.rangeEnd) {
				const startDate = parseInt(this.rangeStart.dataset.value || "0", 10);
				const endDate = parseInt(this.rangeEnd.dataset.value || "0", 10);

				return Math.max(0, moment(endDate * 1000).diff(moment(startDate * 1000), "days") + 1);
			}
			return 0;
		}
		return 0;
	}

	public getInstance(): Calendar {
		return this;
	}

	public setMode(type: "single" | "range") {
		this.mode = type;
		this.clearSelectedDate();
		this.onDateChange(this.selectedDate);
	}
}
