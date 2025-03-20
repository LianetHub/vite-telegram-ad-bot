import { Datepicker } from "vanillajs-datepicker";
import "../../scss/_datepicker.scss";

interface CalendarOptions {
	range: boolean; // Возможность выбора диапазона
	initialDate: Date; // Начальная дата для отображения
}

export class Calendar {
	private datepicker: Datepicker;
	private container: HTMLElement;

	constructor(container: HTMLElement, options: CalendarOptions) {
		this.container = container;

		// Инициализация календаря
		this.datepicker = new Datepicker(container, {
			container: ".calendar",
			autohide: false,
			format: "dd.mm.yyyy", // формат даты
			todayButton: false, // скрытие кнопки "Сегодня"
			clearButton: false, // скрытие кнопки очистки
			daysOfWeekDisabled: [], // нет отключенных дней недели
			title: undefined, // отключение заголовка с месяцем (для кастомного отображения)
			weekStart: 1, // начало недели с понедельника
			// range: options.range, // возможность выбора диапазона
			// Обработчик на изменение даты (если нужно)
			// onSelect: (selectedDate: Date) => {
			// 	this.onDateSelect(selectedDate);
			// },
		});

		// Устанавливаем начальную дату
		this.setMonthForDate(options.initialDate);
	}

	private onDateSelect(date: Date) {
		// Обработчик выбора даты
		console.log("Selected date:", date);
	}

	// Устанавливаем месяц на основе выбранной даты
	public setMonthForDate(date: Date) {
		const month = date.getMonth(); // Месяц из переданной даты
		const year = date.getFullYear(); // Год из переданной даты

		// Получаем текущую дату
		const currentDate = new Date();
		currentDate.setFullYear(year);
		currentDate.setMonth(month);

		// Программно переключаем месяц, задаем новую дату
		this.datepicker.setDate(currentDate, { autohide: true });
	}

	// Открыть календарь
	public open() {
		this.datepicker.show();
	}

	// Закрыть календарь
	public close() {
		this.datepicker.hide();
	}
}
