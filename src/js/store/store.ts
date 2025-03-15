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
	cards: ApiResponse["data"];
	loading: boolean;
	error: string | null;
	cart: string[];
	availableDates?: AvailableDatesResponse;
	startDates?: StartDatesResponse;
	checkAvailability?: CheckAvailabilityResponse;
}

class Store {
	private state: StoreState = {
		cards: [],
		loading: false,
		error: null,
		cart: [],
	};

	private events = new EventEmitter();

	getState() {
		return this.state;
	}

	subscribe(event: string, callback: () => void) {
		this.events.on(event, callback);
	}

	async fetchCards(params: SearchRequest = {}): Promise<void> {
		this.state.loading = true;
		this.events.emit("loading:start");

		try {
			const response: ApiResponse | ApiError = await Api.searchCatalog(params);

			console.log(response);
			if ("error" in response) throw new Error(response.error);

			this.state.cards = response.data;
			this.events.emit("cards:loaded");
		} catch (error) {
			this.state.error = error instanceof Error ? error.message : String(error);
			this.events.emit("error", this.state.error);
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

	/** Получение стартовых дат */
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

	/** Проверка доступности */
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
			this.events.emit("cart:update");
		}
	}

	removeFromCart(itemId: string) {
		this.state.cart = this.state.cart.filter((id) => id !== itemId);
		this.events.emit("cart:update");
	}

	toggleToCart(itemId: string) {
		if (this.state.cart.includes(itemId)) {
			this.removeFromCart(itemId);
		} else {
			this.addToCart(itemId);
		}
	}

	isInCart(itemId: string): boolean {
		return this.state.cart.includes(itemId);
	}
}

export const store = new Store();
