import { EventEmitter } from "../../store/EventEmitter";
import debounce from "lodash.debounce";

export class SearchHandler {
	private debouncedEmit: (event: Event) => void;

	constructor(private eventEmitter: EventEmitter) {
		this.initEventListeners();
		this.debouncedEmit = debounce((event: Event) => {
			this.eventEmitter.emit("filters:change", event);
		}, 300);
	}

	private initEventListeners() {
		document.addEventListener("click", (event: MouseEvent) => {
			const target = event.target as HTMLElement | null;
			if (!target) return;

			const searchBtn = target.closest(".header__search-btn") as HTMLElement | null;
			const searchBottom = document.querySelector(".header__bottom") as HTMLElement | null;
			const searchInput = document.querySelector(".header__search .form__control") as HTMLInputElement;
			if (searchBtn) {
				searchBottom?.classList.add("open-search");
				searchInput?.focus();
			}

			const searchBack = target.closest(".header__search-back") as HTMLElement | null;
			if (searchBack) {
				searchBottom?.classList.remove("open-search");
				const currentValue = searchInput.value;
				if (currentValue.length > 0) {
					searchInput.value = "";
					this.toggleResetSearchBtn(searchInput.value);
					this.eventEmitter.emit("filters:search-reset");
				}
			}

			const resetSearchBtn = target.closest(".header__search-reset") as HTMLElement | null;
			if (resetSearchBtn) {
				searchInput.value = "";
				this.toggleResetSearchBtn(searchInput.value);
				this.eventEmitter.emit("filters:search-reset");
			}
		});
		document.addEventListener("input", this.handleInput.bind(this));
	}

	private toggleResetSearchBtn(query: string) {
		const resetSearchBtn = document.querySelector(".header__search-reset") as HTMLElement;
		if (query.length > 0) {
			resetSearchBtn?.classList.add("visible");
		} else {
			resetSearchBtn?.classList.remove("visible");
		}
	}

	private handleInput(event: Event) {
		const target = event.target as HTMLInputElement;

		if (target.name === "search") {
			this.toggleResetSearchBtn(target.value);
			this.debouncedEmit(event);
		}
	}
}
