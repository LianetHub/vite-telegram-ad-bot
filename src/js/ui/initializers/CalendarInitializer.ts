import { Calendar, HTMLElementWithDatepicker } from "../../components/Calendar";
import { EventEmitter } from "../../store/EventEmitter";
import { calendarUIUpdate, closeModal, openModal } from "../../utils/uiActions";

export class CalendarInitializer {
	constructor(private eventEmitter: EventEmitter) {}

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
					calendarUIUpdate(selectedDate, calendarWrapper, calendarInstance);
				},
				onDateSubmit: (selectedDate) => {
					this.eventEmitter.emit("filters:change-datepicker", selectedDate);
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
					calendarUIUpdate(selectedDate, calendarAvailableWrapper, calendarInstance);
				},
				onDateSubmit: () => {
					closeModal();
					openModal("#check-available-time");
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
}
