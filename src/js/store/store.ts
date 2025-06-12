import { Api } from "../api/api";
import { EventEmitter } from "./EventEmitter";
import {
	SearchRequest,
	ApiResponse,
	ApiError,
	AvailableDatesRequest,
	AvailableDatesResponse,
	StartDatesRequest,
	StartDatesResponse,
	CheckAvailabilityRequest,
	CheckAvailabilityResponse,
	FiltersData,
} from "../api/types";

export interface StoreState {
	fullData: ApiResponse["data"];
	cards: ApiResponse["data"];
	error: string | null;
	cart: string[];
	filters: SearchRequest;
	tempFilters: SearchRequest | null;
	availableDates?: AvailableDatesResponse;
	startDates?: StartDatesResponse;
	checkAvailability?: CheckAvailabilityResponse;
	total?: number;
	filtersData?: FiltersData;
	isSilent: boolean;
}

class Store {
	private state: StoreState = {
		fullData: [],
		cards: [],
		error: null,
		cart: [],
		filters: {},
		tempFilters: null,
		isSilent: false,
	};

	private events = new EventEmitter();
	init: boolean;

	private loadCart() {
		const storedCart = sessionStorage.getItem("cart");
		this.state.cart = storedCart ? JSON.parse(storedCart) : [];
	}

	private saveCart() {
		sessionStorage.setItem("cart", JSON.stringify(this.state.cart));
	}

	constructor() {
		this.loadCart();
		this.init = true;
	}

	getState() {
		return this.state;
	}

	setFilters(filters: Partial<StoreState["filters"]>) {
		this.state.filters = { ...this.state.filters, ...filters };
		console.log("Текущий фильтр", this.state.filters);
	}

	subscribe(event: string, callback: () => void) {
		this.events.on(event, callback);
	}

	setSilent() {
		this.state.isSilent = true;
	}

	removeSilent() {
		this.state.isSilent = false;
	}

	saveTempFilters() {
		this.state.tempFilters = { ...this.state.filters };
	}

	restoreTempFilters() {
		this.state.filters = { ...this.state.tempFilters };
		this.state.tempFilters = null;
		console.log("запрос из рестора");
		this.fetchCards(false);
	}

	clearTempFilters() {
		this.state.tempFilters = null;
	}

	when(eventName: string): Promise<void> {
		return new Promise((resolve) => {
			const callback = () => {
				this.events.off(eventName, callback);
				resolve();
			};

			this.subscribe(eventName, callback);
		});
	}

	async fetchCards(showLoading: boolean = true, params: SearchRequest = this.state.filters): Promise<void> {
		console.log("Начало загрузки c параметами", params);
		if (showLoading) {
			this.events.emit("loading:start");
		}

		try {
			const response: ApiResponse | ApiError = await Api.searchCatalog(params);

			if ("error" in response) throw new Error(response.error);

			this.state.cards = response.data;
			if (this.init) {
				this.state.fullData = response.data;
				this.state.filtersData = response.filters_data;
				this.init = false;
			}

			this.state.total = response.total;
			console.log("Cервер вернул ответ", response);

			if (this.state.cards.length === 0) {
				console.log("Карточек с такими условиями нет");
				this.events.emit("cards:empty");
			} else {
				console.log("Карточки загружены", this.state.cards);
				this.events.emit("cards:loaded");
			}
		} catch (error) {
			this.state.error = error instanceof Error ? error.message : String(error);

			console.log("Ошибка загрузки", this.state.error);
			this.events.emit("cards:loading-error", this.state.error);
		} finally {
			this.events.emit("loading:end");
		}
	}

	async fetchAvailableDates(params: AvailableDatesRequest) {
		this.events.emit("loading:start");

		try {
			const response = await Api.getAvailableDates(params);
			if ("error" in response) throw new Error(response.error);

			this.state.availableDates = response;
			this.events.emit("availableDates:loaded");
		} catch (error) {
			// this.state.error = error.message;
			// this.events.emit("error", error.message);
		} finally {
			this.events.emit("loading:end");
		}
	}

	async fetchStartDates(params: StartDatesRequest) {
		this.events.emit("loading:start");

		try {
			const response = await Api.getStartDates(params);
			if ("error" in response) throw new Error(response.error);

			this.state.startDates = response;
			this.events.emit("startDates:loaded");
		} catch (error) {
			// this.state.error = error.message;
			// this.events.emit("error", error.message);
		} finally {
			this.events.emit("loading:end");
		}
	}

	async checkAvailability(params: CheckAvailabilityRequest) {
		this.events.emit("loading:start");

		try {
			const response = await Api.checkAvailability(params);
			if ("error" in response) throw new Error(response.error);

			this.state.checkAvailability = response;
			this.events.emit("availability:checked");
		} catch (error) {
			// this.state.error = error.message;
			// this.events.emit("error", error.message);
		} finally {
			this.events.emit("loading:end");
		}
	}

	addToCart(itemId: string) {
		console.log(`Товар ${itemId} добавлен в корзину`);

		if (!this.state.cart.includes(itemId)) {
			this.state.cart.push(itemId);
			this.saveCart();
			this.updateTotalCart();
			this.events.emit("cart:update");
		}
	}

	removeFromCart(itemId: string) {
		console.log(`Товар ${itemId} удален в корзину`);

		this.state.cart = this.state.cart.filter((id) => id !== itemId);
		this.saveCart();
		this.updateTotalCart();
		this.events.emit("cart:update");
		if (this.state.cart.length === 0) {
			this.clearCart();
		}
	}

	toggleToCart(itemId: string) {
		console.log(`Товар ${itemId} toggle в корзину`);

		if (this.state.cart.includes(itemId)) {
			this.removeFromCart(itemId);
		} else {
			this.addToCart(itemId);
		}
	}

	updateTotalCart() {
		const total = this.state.cart.reduce((sum, itemId) => {
			const item = this.state.fullData.find((card) => card.id === +itemId);

			return item ? sum + item.total_price : sum;
		}, 0);

		this.state.total = total;

		console.log("Количество товар в корзине обновлено", total);

		this.events.emit("cart:update");
	}

	isInCart(itemId: number): boolean {
		return this.state.cart.includes(itemId.toString());
	}

	clearCart() {
		sessionStorage.removeItem("cart");
		this.state.cart = [];
		this.updateTotalCart();
		this.events.emit("cart:cleared");
	}
}

export const store = new Store();
