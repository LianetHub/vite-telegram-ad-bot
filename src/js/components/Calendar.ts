import moment from "moment";
import "../../scss/_datepicker.scss";

interface CalendarOptions {
	monthsToRender?: number;
}

export class Calendar {
	private container: HTMLElement;
	private monthsToRender: number;

	constructor(container: HTMLElement, options: CalendarOptions = {}) {
		this.container = container;
		this.monthsToRender = options.monthsToRender || 24;
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

			dayItem.addEventListener("click", () => this.selectDay(dayItem));

			monthBody.appendChild(dayItem);
		}

		monthBlock.appendChild(monthBody);
		return monthBlock;
	}

	private selectDay(dayElement: HTMLElement) {
		const allDays = this.container.querySelectorAll(".calendar__item");
		allDays.forEach((day) => (day as HTMLElement).classList.remove("selected"));
		dayElement.classList.add("selected");
	}
}
