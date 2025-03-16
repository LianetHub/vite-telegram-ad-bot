export class Calendar {
	private calendarElement: HTMLElement;
	private inputElement: HTMLInputElement | null;
	private static months = [
		{ name: "Январь", days: [] },
		{ name: "Февраль", days: [] },
		{ name: "Март", days: [] },
		{ name: "Апрель", days: [] },
		{ name: "Май", days: [] },
		{ name: "Июнь", days: [] },
		{ name: "Июль", days: [] },
		{ name: "Август", days: [] },
		{ name: "Сентябрь", days: [] },
		{ name: "Октябрь", days: [] },
		{ name: "Ноябрь", days: [] },
		{ name: "Декабрь", days: [] },
	];

	constructor(inputId: string) {
		this.inputElement = document.getElementById(inputId) as HTMLInputElement;
		this.calendarElement = this.createCalendar();
		this.inputElement.parentNode?.appendChild(this.calendarElement);
	}

	private createCalendar(): HTMLElement {
		const calendarContainer = document.createElement("div");
		calendarContainer.classList.add("calendar");

		// Получаем текущий месяц и следующий
		const currentDate = new Date();
		const currentMonthIndex = currentDate.getMonth();
		const nextMonthIndex = (currentMonthIndex + 1) % 12;

		const monthsToRender = [currentMonthIndex, nextMonthIndex];

		monthsToRender.forEach((monthIndex) => {
			const monthBlock = this.createMonthBlock(monthIndex);
			calendarContainer.appendChild(monthBlock);
		});

		return calendarContainer;
	}

	private createMonthBlock(monthIndex: number): HTMLElement {
		const monthData = Calendar.months[monthIndex];
		const monthBlock = document.createElement("div");
		monthBlock.classList.add("calendar__block");

		const monthName = document.createElement("div");
		monthName.classList.add("calendar__month");
		monthName.innerText = monthData.name;

		const monthBody = document.createElement("div");
		monthBody.classList.add("calendar__body");

		const firstDay = new Date(new Date().getFullYear(), monthIndex, 1);
		const lastDay = new Date(new Date().getFullYear(), monthIndex + 1, 0);

		const daysInMonth = lastDay.getDate();
		const firstDayOfWeek = firstDay.getDay();

		// Заполнение пустыми днями до первого дня месяца
		for (let i = 0; i < firstDayOfWeek; i++) {
			monthBody.appendChild(this.createEmptyDay());
		}

		// Добавление всех дней месяца
		for (let day = 1; day <= daysInMonth; day++) {
			monthBody.appendChild(this.createDay(day));
		}

		monthBlock.appendChild(monthName);
		monthBlock.appendChild(monthBody);

		return monthBlock;
	}

	private createEmptyDay(): HTMLElement {
		const emptyDay = document.createElement("div");
		emptyDay.classList.add("calendar__item");
		return emptyDay;
	}

	private createDay(day: number): HTMLElement {
		const dayElement = document.createElement("div");
		dayElement.classList.add("calendar__item");

		const currentDate = new Date();
		if (currentDate.getDate() === day && currentDate.getMonth() === new Date().getMonth()) {
			dayElement.classList.add("today");
		}

		dayElement.innerText = day.toString();

		dayElement.addEventListener("click", () => {
			this.selectDay(day);
		});

		return dayElement;
	}

	private selectDay(day: number): void {
		const selectedDay = this.calendarElement.querySelector(".calendar__item.selected");
		if (selectedDay) {
			selectedDay.classList.remove("selected");
		}

		const dayElements = this.calendarElement.querySelectorAll(".calendar__item");
		dayElements.forEach((item) => {
			if (item.innerHTML == day.toString()) {
				item.classList.add("selected");
			}
		});

		if (this.inputElement) {
			this.inputElement.value = `${day}`;
		}
	}
}
