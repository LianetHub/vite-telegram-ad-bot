import { EventEmitter } from "../../store/EventEmitter";
import { toggleResetSearchBtn } from "../../utils/uiActions";
import debounce from "lodash.debounce";

export class InputHandler {
	private debouncedEmit: (event: Event) => void;

	constructor(private eventEmitter: EventEmitter) {
		this.debouncedEmit = debounce((event: Event) => {
			this.eventEmitter.emit("filters:change", event);
		}, 300);

		document.addEventListener("input", this.handleInput.bind(this));
	}

	private handleInput(event: Event) {
		const target = event.target as HTMLInputElement;

		if (target.name === "search") {
			toggleResetSearchBtn(target.value);
			this.debouncedEmit(event);
		}
	}
}
