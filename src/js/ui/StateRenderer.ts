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
		console.log("Рендер пустого состояния");

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

	updateFiltersAvailability(): void {
		const { filtersData, filters } = store.getState();

		if (!filtersData?.static) return;

		const { categories: availableCategories, languages: availableLanguages } = filtersData.static;

		const categoryInputs = document.querySelectorAll<HTMLInputElement>('input[name="categories"]');
		categoryInputs.forEach((input) => {
			if (availableCategories.includes(input.value)) {
				input.disabled = false;
			} else {
				input.disabled = true;
			}
		});

		const languageInputs = document.querySelectorAll<HTMLInputElement>('input[name="languages"]');
		languageInputs.forEach((input) => {
			const lang = input.value;
			const langData = availableLanguages[lang];
			const label = input.closest("label");

			if (!langData) {
				input.disabled = true;
				if (input.checked) input.checked = false;
				label?.setAttribute("style", "display: none");
				return;
			}

			label?.removeAttribute("style");

			if (filters?.premium) {
				if (!langData.premium) {
					if (input.checked) {
						input.click();
					}
					input.disabled = true;
				} else {
					input.disabled = false;
				}
			} else {
				input.disabled = false;
			}
		});
	}

	setFiltersValue(): void {
		console.log("set range new values");

		const { filtersData, filters } = store.getState();

		if (!filtersData?.static) return;

		const { users_count } = filtersData.static;
		const usePremium = filters?.premium === true;
		const priceType = filters?.price_type;

		let priceMin: number, priceMax: number;

		if (priceType === "per_100k") {
			const { price_per_100k } = filtersData.static;
			priceMin = usePremium ? Math.floor(price_per_100k.min.premium) : Math.floor(price_per_100k.min.non_premium);
			priceMax = usePremium ? Math.ceil(price_per_100k.max.premium) : Math.ceil(price_per_100k.max.non_premium);
		} else {
			const { price_total } = filtersData.static;
			priceMin = usePremium ? Math.floor(price_total.min.premium) : Math.floor(price_total.min.non_premium);
			priceMax = usePremium ? Math.ceil(price_total.max.premium) : Math.ceil(price_total.max.non_premium);
		}
		const usersMin = usePremium ? Math.floor(users_count.min.premium) : Math.floor(users_count.min.non_premium);
		const usersMax = usePremium ? Math.ceil(users_count.max.premium) : Math.ceil(users_count.max.non_premium);

		const priceMinInput = document.querySelector<HTMLInputElement>("input[name='price_min']");
		const priceMaxInput = document.querySelector<HTMLInputElement>("input[name='price_max']");
		const usersMinInput = document.querySelector<HTMLInputElement>("input[name='users_min']");
		const usersMaxInput = document.querySelector<HTMLInputElement>("input[name='users_max']");

		if (priceMinInput) {
			priceMinInput.setAttribute("value", priceMin.toString());
		}

		if (priceMaxInput) {
			priceMaxInput.setAttribute("value", priceMax.toString());
		}

		if (usersMinInput) {
			usersMinInput.setAttribute("value", usersMin.toString());
		}

		if (usersMaxInput) {
			usersMaxInput.setAttribute("value", usersMax.toString());
		}
	}
}
