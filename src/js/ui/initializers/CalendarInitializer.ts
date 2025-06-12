import { Calendar, HTMLElementWithDatepicker } from "../../components/Calendar";
import { Modal } from "../../components/Modal";
import { EventEmitter } from "../../store/EventEmitter";

export class CalendarInitializer {
	constructor(private eventEmitter: EventEmitter, private modalInstanse: Modal) {}

	initializeCalendars() {
		this.initMainCalendar();
		this.initAvailableTimeCalendar();
	}

	private initMainCalendar() {
		const calendarElement = document.getElementById("datepicker") as HTMLElement;

		if (calendarElement) {
			const calendarWrapper = calendarElement.closest(".calendar") as HTMLElement;
			const calendarInstance = new Calendar(calendarElement, {
				onDateChange: (selectedDate) => {
					this.calendarUIUpdate(selectedDate, calendarWrapper, calendarInstance);
				},
				onDateSubmit: (selectedDate) => {
					this.eventEmitter.emit("filters:change-datepicker", selectedDate);
				},
				onReset: () => {
					this.eventEmitter.emit("filters:reset-datepicker");
					this.calendarUIUpdate(undefined, calendarWrapper, calendarInstance);
				},
			});
		}
	}

	private initAvailableTimeCalendar() {
		const calendarAvailableElement = document.getElementById("datepicker-available") as HTMLElement;

		if (calendarAvailableElement) {
			const calendarAvailableWrapper = calendarAvailableElement.closest(".calendar") as HTMLElement;
			const calendarInstance = new Calendar(calendarAvailableElement, {
				onDateChange: (selectedDate) => {
					this.calendarUIUpdate(selectedDate, calendarAvailableWrapper, calendarInstance);
				},
				onDateSubmit: () => {
					this.modalInstanse.openModal("#check-available-time");
				},
			});
		}
	}

	public changeDatepickerType(event: Event) {
		const target = event.target as HTMLInputElement;
		const type = target.value as "single" | "range";
		const currentDatepicker = target.closest(".calendar") as HTMLElementWithDatepicker;
		const DatepickerIntanse = currentDatepicker?.datepicker as Calendar | null;
		if (DatepickerIntanse) {
			DatepickerIntanse.setMode(type);
		}
	}

	public calendarUIUpdate(date: string[] | undefined, calendarWrapper: HTMLElement, instance: Calendar | null = null) {
		console.log(`Обновление UI Календаря. Выбранно: ${date}`);

		const selectedDaysBlock = calendarWrapper.querySelector('[data-name="selected-days"]') as HTMLElement;
		const selectedDaysText = calendarWrapper.querySelector('[data-text="selected-days"]') as HTMLElement;

		let selectedDayValue = 1;
		let selectedDayTextValue = "день";

		const quantitySelectedDays = instance?.getQuantitySelectedDays() || 0;

		if (quantitySelectedDays > 1) {
			selectedDayValue = quantitySelectedDays;
			selectedDayTextValue = getCorrectDayDeclension(quantitySelectedDays);
		} else if (date?.length) {
			selectedDayValue = 1;
			selectedDayTextValue = "день";
		}

		function getCorrectDayDeclension(count: number): string {
			if (count === 1) {
				return "день";
			} else if (count >= 2 && count <= 4) {
				return "дня";
			} else {
				return "дней";
			}
		}

		selectedDaysBlock.textContent = String(selectedDayValue);
		selectedDaysText.textContent = selectedDayTextValue;

		const submitButton = calendarWrapper.querySelector("[data-calendar-submit]");
		if (date?.length && calendarWrapper) {
			submitButton?.classList.remove("hide");
			calendarWrapper?.classList.add("modal-selected");
		} else {
			submitButton?.classList.add("hide");
			calendarWrapper?.classList.remove("modal-selected");
		}
	}
}
