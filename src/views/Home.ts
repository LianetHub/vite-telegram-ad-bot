import { CardList } from "../components/CardList";
import { searchCatalog } from "../js/api";

import { ApiResponse, ApiError } from "../js/types";
import { CardProps } from "../js/types";

export class Home {
	private rootElement: HTMLElement;
	private loaderElement: HTMLElement;

	constructor(rootElementId: string) {
		const root = document.getElementById(rootElementId);
		if (!root) {
			throw new Error(`Элемент с id "${rootElementId}" не найден`);
		}
		this.rootElement = root;

		this.loaderElement = document.createElement("div");
		this.loaderElement.className = "loader";
		this.loaderElement.innerHTML = "Загрузка...";
	}

	async fetchData(): Promise<void> {
		this.showLoader();

		try {
			const response: ApiResponse | ApiError = await searchCatalog({});

			if ("error" in response) {
				throw new Error(response.error);
			}

			const cardsData: CardProps[] = response.data;
			this.render(cardsData);
		} catch (error) {
			console.error("Ошибка загрузки:", error);
			this.rootElement.innerHTML = "<p>Ошибка загрузки данных</p>";
		} finally {
			this.hideLoader();
		}
	}

	private showLoader(): void {
		this.rootElement.appendChild(this.loaderElement);
	}

	private hideLoader(): void {
		this.loaderElement.remove();
	}

	render(cardsData: CardProps[]): void {
		this.rootElement.innerHTML = "";
		const cardList = new CardList(cardsData);
		this.rootElement.appendChild(cardList.render());
	}
}
