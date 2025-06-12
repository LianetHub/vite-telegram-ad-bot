import { EventEmitter } from "../../store/EventEmitter";
import debounce from "lodash.debounce";

export class SearchHandler {
	private debouncedEmit: (event: Event) => void;
	private searchInput: HTMLInputElement | null;
	private searchResetBtn: HTMLElement | null;
	private searchBottom: HTMLElement | null;

	constructor(private eventEmitter: EventEmitter) {
		this.searchInput = document.querySelector('input[name="search"]');
		this.searchResetBtn = document.querySelector(".header__search-reset");
		this.searchBottom = document.querySelector(".header__bottom");
		this.debouncedEmit = debounce((event: Event) => {
			this.eventEmitter.emit("filters:change", event);
		}, 300);

		this.initEventListeners();
	}

	private initEventListeners() {
		document.addEventListener("click", this.handleClick.bind(this));
		document.addEventListener("input", this.handleInput.bind(this));

		this.searchInput?.addEventListener("focus", () => this.toggleBagPosition(true));
		this.searchInput?.addEventListener("blur", () => this.toggleBagPosition(false));
		this.searchInput?.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				this.searchInput?.blur();
			}
		});
	}

	private handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target) return;

		if (target.closest(".header__search-btn")) {
			this.searchBottom?.classList.add("open-search");
			this.searchInput?.focus();
			this.toggleBagPosition(true);
		}

		if (target.closest(".header__search-back")) {
			this.hideAndClearSearch();
		}

		if (target.closest(".header__search-reset")) {
			this.resetSearch();
		}
	}

	private handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.name === "search") {
			this.toggleResetSearchBtn(target.value);
			this.debouncedEmit(event);
		}
	}

	private toggleResetSearchBtn(value: string) {
		if (value.length > 0) {
			this.searchResetBtn?.classList.add("visible");
		} else {
			this.searchResetBtn?.classList.remove("visible");
		}
	}

	public resetSearch() {
		if (this.searchInput) {
			const hadValue = this.searchInput.value.trim().length > 0;
			this.searchInput.value = "";
			this.toggleResetSearchBtn("");
			this.eventEmitter.emit("filters:search-reset", hadValue ? true : undefined);
		}
	}

	public hideSearch(timeout: number = 300) {
		this.searchBottom?.style.setProperty("--search-animation-timeout", `${timeout}ms`);
		this.searchBottom?.classList.remove("open-search");
		this.toggleBagPosition(false);
		setTimeout(() => {
			this.searchBottom?.removeAttribute("style");
		}, timeout);
	}

	public hideAndClearSearch() {
		this.hideSearch();
		this.resetSearch();
	}

	private toggleBagPosition(fix: boolean) {
		const bag = document.querySelector(".bag") as HTMLElement | null;
		if (!bag) return;

		if (fix) {
			const rect = bag.getBoundingClientRect();
			Object.assign(bag.style, {
				position: "absolute",
				top: `${rect.top + window.scrollY}px`,
				left: `${rect.left + window.scrollX}px`,
				width: `${rect.width}px`,
				height: `${rect.height}px`,
				transform: "none",
			});
		} else {
			bag.removeAttribute("style");
		}
	}
}
