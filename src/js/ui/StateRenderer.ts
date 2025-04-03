import { CardList } from "../components/CardList";
import { EmptyState } from "../components/Empty";
import { SkeletonCardList } from "../components/Skeleton";
import { store } from "../store/store";

export class StateRenderer {
	constructor() {
		this.showSkeleton = this.showSkeleton.bind(this);
		this.showEmptyState = this.showEmptyState.bind(this);
		this.showErrorLoading = this.showErrorLoading.bind(this);
		this.renderCards = this.renderCards.bind(this);
	}

	private _updateAppContent(content: HTMLElement): void {
		const appWrapper = document.querySelector("#app");
		if (!appWrapper) return;
		appWrapper.innerHTML = "";
		appWrapper.appendChild(content);
	}

	showSkeleton(): void {
		const skeleton = new SkeletonCardList(3);
		this._updateAppContent(skeleton.render());
	}

	showEmptyState(): void {
		const emptyState = new EmptyState({
			message: "Нет результатов",
			showButton: false,
		});
		this._updateAppContent(emptyState.render());
	}

	showErrorLoading(): void {
		const emptyState = new EmptyState({
			imageType: "empty",
			message: "Ошибка загрузки",
			subtitle: "Попробуйте позднее",
			showButton: false,
		});
		this._updateAppContent(emptyState.render());
	}

	renderCards(cards = store.getState().cards): void {
		console.log("Рендер карточек");

		if (!cards.length) {
			this.showEmptyState();
			return;
		}

		const cardList = new CardList(cards);
		this._updateAppContent(cardList.render());
	}
}
