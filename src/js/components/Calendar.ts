import { Datepicker } from "vanillajs-datepicker";
import "../../scss/_datepicker.scss";

const myLocales = {
	ru: {
		days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
		daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
		daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
		today: "Сегодня",
		clear: "Очистить",
		format: "dd.mm.yyyy",
		weekStart: 1,
		monthsTitle: "Месяцы",
	},
};

Object.assign(Datepicker.locales, myLocales);

interface CalendarOptions {
	range: boolean;
	initialDate?: Date;
	onDateSelect?: (date: string | null) => void;
}

export class Calendar {
	private datepicker: Datepicker;
	private container: HTMLElement;
	private onDateSelect?: (date: string | null) => void;
	private selectedDate: string | null = null;

	constructor(container: HTMLElement, options: CalendarOptions) {
		this.container = container;
		this.onDateSelect = options.onDateSelect;

		this.datepicker = new Datepicker(this.container, {
			language: "ru",
			container: ".calendar",
			autohide: false,
			format: "dd.mm.yyyy",
			todayButton: false,
			clearButton: false,
			showDaysOfWeek: false,
			todayHighlight: true,
			title: undefined,
			weekStart: 1,
		});

		this.init();
	}

	private init() {
		this.container.addEventListener("changeDate", (event: Event) => {
			const selectedDate = (event as CustomEvent).detail.date;
			this.selectedDate = selectedDate ? this.formatDate(selectedDate) : null;
			this.onDateSelect?.(this.selectedDate);
		});
	}

	private formatDate(date: Date): string {
		const dd = String(date.getDate()).padStart(2, "0");
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const yyyy = date.getFullYear();
		return `${dd}.${mm}.${yyyy}`;
	}
}
