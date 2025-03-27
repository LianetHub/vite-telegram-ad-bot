import moment from "moment";
import "../../scss/_datepicker.scss";

interface CalendarOptions {
	monthsToRender?: number;
	onDateChange?: (selectedDate: string[] | undefined) => void;
	onDateSubmit?: (selectedDate: string[] | undefined) => void;
}

export class Calendar {
	private container: HTMLElement;
	private monthsToRender: number;
	private selectedDate: string[] | undefined = undefined;
	private onDateChange: (selectedDate: string[] | undefined) => void;
	private onDateSubmit: (selectedDate: string[] | undefined) => void;
	private resetBtn: HTMLElement | null = null;
	private submitBtn: HTMLElement | null = null;

	constructor(container: HTMLElement, options: CalendarOptions = {}) {
		this.container = container;
		this.monthsToRender = options.monthsToRender || 24;
		this.onDateChange = options.onDateChange || (() => {});
		this.onDateSubmit = options.onDateSubmit || (() => {});
		this.resetBtn = document.querySelector("[data-reset-calendar]") || null;
		this.submitBtn = document.querySelector("[data-calendar-submit]") || null;

		moment.locale("ru");
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
		monthName.textContent = month.format("MMMM YYYY");
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
			this.onDateChange(undefined);
		});

		this.submitBtn?.addEventListener("click", (e) => {
			this.submitBtn?.classList.add("loading");
			this.onDateSubmit(this.selectedDate);
		});
	}

	private selectDay(dayElement: HTMLElement) {
		const allDays = this.container.querySelectorAll(".calendar__item");
		const isSelected = dayElement.classList.contains("selected");

		if (isSelected) {
			dayElement.classList.remove("selected");
			this.clearSelectedDate();
		} else {
			allDays.forEach((day) => (day as HTMLElement).classList.remove("selected"));
			dayElement.classList.add("selected");

			this.addDayToSelected(dayElement);
		}
	}

	private addDayToSelected(dayElement: HTMLElement) {
		const dayMoment = moment(dayElement.textContent, "D").unix().toString();

		if (this.selectedDate === undefined) {
			this.selectedDate = [dayMoment];
		} else if (Array.isArray(this.selectedDate)) {
			this.selectedDate = [dayMoment];
		} else {
			this.selectedDate = [this.selectedDate as string, dayMoment];
		}

		this.onDateChange(this.selectedDate);
	}

	private clearSelectedDate() {
		this.selectedDate = undefined;
		const selectedDay = this.container.querySelector(".calendar__item.selected");
		if (selectedDay) {
			selectedDay.classList.remove("selected");
		}

		this.onDateChange(undefined);
	}

	public getSelectedDate(): string[] | string | undefined {
		return this.selectedDate;
	}
}
