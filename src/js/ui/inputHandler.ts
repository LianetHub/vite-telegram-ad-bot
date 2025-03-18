import { EventEmitter } from "../store/EventEmitter";
import { toggleResetSearchBtn } from "../utils/uiActions";

export class InputHandler {
	constructor(private eventEmitter: EventEmitter) {
		document.addEventListener("input", this.handleInput.bind(this));
	}

	private handleInput(event: Event) {
		const target = event.target as HTMLInputElement;

		if (target.name === "search") {
			toggleResetSearchBtn(target.value);
			this.eventEmitter.emit("filters:change", event);
		}
	}
}
