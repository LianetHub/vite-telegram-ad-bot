import moment from "moment";
import "../../scss/_datepicker.scss";

interface CalendarOptions {
	monthsToRender?: number;
	onDateChange?: (selectedDate: number | number[] | null) => void;
}

export class Calendar {
	private container: HTMLElement;
	private monthsToRender: number;
	private selectedDate: number | null = null;
	private onDateChange: (selectedDate: number | null) => void;
	private resetBtn: HTMLElement | null = null;

	constructor(container: HTMLElement, options: CalendarOptions = {}) {
		this.container = container;
		this.monthsToRender = options.monthsToRender || 24;
		this.onDateChange = options.onDateChange || (() => {});
		this.resetBtn = document.querySelector("[data-reset-calendar]") || null;

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

			if (target && target.closest(".calendar__item")) {
				this.selectDay(target);
			}
		});

		this.resetBtn?.addEventListener("click", () => {
			console.log("clear calendar");

			this.selectedDate = null;
			this.onDateChange(null);
		});
	}

	private selectDay(dayElement: HTMLElement) {
		const allDays = this.container.querySelectorAll(".calendar__item");
		allDays.forEach((day) => (day as HTMLElement).classList.remove("selected"));
		dayElement.classList.add("selected");

		const dayMoment = moment(dayElement.textContent, "D");
		this.selectedDate = dayMoment.unix();

		this.onDateChange(this.selectedDate);
	}

	public getSelectedDate(): number | null {
		return this.selectedDate;
	}

	public clearSelectedDate() {
		this.selectedDate = null;
		const selectedDay = this.container.querySelector(".calendar__item.selected");
		if (selectedDay) {
			selectedDay.classList.remove("selected");
		}

		this.onDateChange(null);
	}
}
