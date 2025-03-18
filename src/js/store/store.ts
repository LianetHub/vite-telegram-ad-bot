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
} from "../api/types";

export interface StoreState {
	fullData: ApiResponse["data"];
	cards: ApiResponse["data"];
	loading: boolean;
	error: string | null;
	cart: string[];
	filters: SearchRequest;
	availableDates?: AvailableDatesResponse;
	startDates?: StartDatesResponse;
	checkAvailability?: CheckAvailabilityResponse;
	total?: number;
}

// export type CartState = {
// 	id: number;
// 	sending_count?: number;
// };

class Store {
	private state: StoreState = {
		fullData: [],
		cards: [],
		loading: false,
		error: null,
		cart: [],
		filters: {},
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
		this.events.emit("filters:updated");
		console.log("Текущий фильтр", this.state.filters);
	}

	subscribe(event: string, callback: () => void) {
		this.events.on(event, callback);
	}

	async fetchCards(params: SearchRequest = this.state.filters): Promise<void> {
		this.state.loading = true;
		console.log("Начало загрузки");
		this.events.emit("loading:start");

		try {
			const response: ApiResponse | ApiError = await Api.searchCatalog(params);

			if ("error" in response) throw new Error(response.error);

			this.state.cards = response.data;
			if (this.init) {
				this.state.fullData = response.data;
				this.init = false;
			}

			if (this.state.cards.length === 0) {
				console.log("Карточек с такими условиями нет");
				this.events.emit("cards:empty");
			} else {
				console.log("Карточки загружены", this.state.cards);
				this.events.emit("cards:loaded");
			}

			this.updateTotalCart();
		} catch (error) {
			this.state.error = error instanceof Error ? error.message : String(error);

			console.log("Ошибка загрузки", this.state.error);
			this.events.emit("cards:loading-error", this.state.error);
		} finally {
			this.state.loading = false;
			this.events.emit("loading:end");
		}
	}

	async fetchAvailableDates(params: AvailableDatesRequest) {
		this.state.loading = true;
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
			this.state.loading = false;
			this.events.emit("loading:end");
		}
	}

	async fetchStartDates(params: StartDatesRequest) {
		this.state.loading = true;
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
			this.state.loading = false;
			this.events.emit("loading:end");
		}
	}

	async checkAvailability(params: CheckAvailabilityRequest) {
		this.state.loading = true;
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
			this.state.loading = false;
			this.events.emit("loading:end");
		}
	}

	addToCart(itemId: string) {
		if (!this.state.cart.includes(itemId)) {
			this.state.cart.push(itemId);
			this.saveCart();
			this.updateTotalCart();
			this.events.emit("cart:update");
		}
	}

	removeFromCart(itemId: string) {
		this.state.cart = this.state.cart.filter((id) => id !== itemId);
		this.saveCart();
		this.updateTotalCart();
		this.events.emit("cart:update");
		if (this.state.cart.length === 0) {
			this.clearCart();
		}
	}

	toggleToCart(itemId: string) {
		if (this.state.cart.includes(itemId)) {
			this.removeFromCart(itemId);
		} else {
			this.addToCart(itemId);
		}
	}

	private updateTotalCart() {
		const total = this.state.cart.reduce((sum, itemId) => {
			const item = this.state.fullData.find((card) => card.id === +itemId);

			return item ? sum + item.total_price : sum;
		}, 0);

		this.state.total = total;
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
