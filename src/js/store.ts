// store.ts

// Храним данные о текущем состоянии приложения
interface StoreState {
	selectedLanguages: string[];
	selectedDates: number[];
	premium: boolean;
}

class Store {
	private state: StoreState;

	constructor() {
		this.state = {
			selectedLanguages: ["en", "ru"],
			selectedDates: [],
			premium: true,
		};
	}

	// Получить текущее состояние
	getState() {
		return this.state;
	}

	// Обновить выбранные языки
	setLanguages(languages: string[]) {
		this.state.selectedLanguages = languages;
	}

	// Обновить выбранные даты
	setDates(dates: number[]) {
		this.state.selectedDates = dates;
	}

	// Установить значение premium
	setPremium(premium: boolean) {
		this.state.premium = premium;
	}
}

// Экземпляр глобального состояния
export const store = new Store();
